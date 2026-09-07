import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { redeemInviteForUser } from "@/lib/invites";
import { grantDailyBonusIfDue } from "@/lib/dailyBonus";

// Only register Google when its credentials are present, so the app still boots
// (and email/password still works) before you've set up an OAuth app.
const googleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

// Emails in ADMIN_EMAILS (comma-separated) get promoted to role "admin" the
// next time they sign in — see the jwt callback below.
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const authOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    ...(googleEnabled
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // If a user already registered this email via password, link the
            // Google login to that same account instead of erroring.
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
  callbacks: {
    // Redeems a beta invite code (set as a cookie by the login page from
    // ?invite=CODE) for OAuth sign-ins — the credentials path handles its
    // own invite code directly in the signup request body.
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.id) {
        const code = cookies().get("invite_code")?.value;
        if (code) await redeemInviteForUser(code, user.id).catch(() => {});
      }
      // Small credit bonus once per calendar day, on any sign-in.
      if (user?.id) await grantDailyBonusIfDue(user.id).catch(() => {});
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role ?? "user";
      }

      // Auto-promote configured admin emails, and keep the token's role in
      // sync with the DB in case it was changed elsewhere.
      if (token.email && ADMIN_EMAILS.includes(token.email.toLowerCase())) {
        if (token.role !== "admin") {
          const promoted = await db.user.update({
            where: { email: token.email },
            data: { role: "admin" },
          }).catch(() => null);
          if (promoted) token.role = "admin";
        }
      } else if (token.uid && !token.role) {
        const dbUser = await db.user.findUnique({ where: { id: token.uid } });
        token.role = dbUser?.role ?? "user";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid;
        session.user.role = token.role ?? "user";
      }
      return session;
    },
  },
};
