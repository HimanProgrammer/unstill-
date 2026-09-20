import { redirect } from "next/navigation";
import { requireUserId } from "@/lib/session";
import { db } from "@/lib/db";

export default async function AffiliatePage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, credits: true, role: true },
  });

  const affiliateCode = generateAffiliateCode(userId);
  const affiliateUrl = `https://unstll.ai/?ref=${affiliateCode}`;
  const polloAffiliateUrl = `https://pollo.ai/?ref=${affiliateCode}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium">Affiliate Program</h1>
        <p className="mt-1 text-sm text-mute">Earn commission by referring Pollo.ai subscriptions</p>
      </div>

      {/* Pollo.ai Affiliate Program */}
      <div className="card space-y-6 p-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-medium">
            🎬 Pollo.ai Affiliate Program
          </h2>
          <p className="mt-1 text-sm text-mute">
            Earn 30% commission on every Pollo.ai subscription you refer
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Tracking Link */}
          <div className="rounded border border-rail/30 bg-ink-darker/30 p-4">
            <p className="text-xs font-mono uppercase tracking-widest text-mute">Referral Link</p>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={polloAffiliateUrl}
                className="field flex-1 text-xs"
              />
              <button
                onClick={() => navigator.clipboard.writeText(polloAffiliateUrl)}
                className="rounded bg-amber px-3 py-2 text-xs text-ink transition hover:bg-amber/80"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Commission Rate */}
          <div className="rounded border border-rail/30 bg-ink-darker/30 p-4">
            <p className="text-xs font-mono uppercase tracking-widest text-mute">Commission Rate</p>
            <p className="mt-2 text-2xl font-bold text-amber">30%</p>
            <p className="text-xs text-mute">per subscription</p>
          </div>

          {/* Cookie Duration */}
          <div className="rounded border border-rail/30 bg-ink-darker/30 p-4">
            <p className="text-xs font-mono uppercase tracking-widest text-mute">Cookie Duration</p>
            <p className="mt-2 text-2xl font-bold text-amber">30 Days</p>
            <p className="text-xs text-mute">tracking window</p>
          </div>
        </div>

        {/* Pollo.ai Plans */}
        <div className="mt-6 space-y-4">
          <h3 className="font-medium">Pollo.ai Subscription Plans</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Starter */}
            <div className="rounded border border-rail/30 p-4">
              <p className="font-medium">Starter</p>
              <p className="text-2xl font-bold text-amber">$9/mo</p>
              <ul className="mt-3 space-y-2 text-xs text-mute">
                <li>✓ 100 videos/month</li>
                <li>✓ All 5 models</li>
                <li>✓ up to 10s videos</li>
                <li>✓ Standard quality</li>
              </ul>
              <p className="mt-3 rounded bg-amber/20 p-2 text-xs font-medium text-amber">
                You earn: $2.70 per referral
              </p>
            </div>

            {/* Pro */}
            <div className="rounded border border-amber/30 bg-amber/5 p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Pro</p>
                <span className="rounded bg-amber px-2 py-1 text-[10px] font-bold text-ink">POPULAR</span>
              </div>
              <p className="text-2xl font-bold text-amber">$29/mo</p>
              <ul className="mt-3 space-y-2 text-xs text-mute">
                <li>✓ 500 videos/month</li>
                <li>✓ All 5 models</li>
                <li>✓ up to 15s videos</li>
                <li>✓ HD quality</li>
                <li>✓ Priority processing</li>
              </ul>
              <p className="mt-3 rounded bg-amber/20 p-2 text-xs font-medium text-amber">
                You earn: $8.70 per referral
              </p>
            </div>

            {/* Enterprise */}
            <div className="rounded border border-rail/30 p-4">
              <p className="font-medium">Enterprise</p>
              <p className="text-2xl font-bold text-amber">Custom</p>
              <ul className="mt-3 space-y-2 text-xs text-mute">
                <li>✓ Unlimited videos</li>
                <li>✓ All 5 models</li>
                <li>✓ Custom duration</li>
                <li>✓ 4K quality</li>
                <li>✓ API access</li>
                <li>✓ Dedicated support</li>
              </ul>
              <p className="mt-3 rounded bg-amber/20 p-2 text-xs font-medium text-amber">
                You earn: 30% of deal value
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-6 rounded border border-rail/30 bg-ink-darker/30 p-4">
          <h3 className="font-medium">How It Works</h3>
          <ol className="mt-3 space-y-2 text-sm text-mute">
            <li>
              <strong>1. Share your referral link</strong> with your audience, community, or clients
            </li>
            <li>
              <strong>2. Customers sign up</strong> through your link (30-day cookie)
            </li>
            <li>
              <strong>3. They subscribe</strong> to a Pollo.ai plan (Starter, Pro, or Enterprise)
            </li>
            <li>
              <strong>4. You earn 30%</strong> commission on their subscription price
            </li>
            <li>
              <strong>5. Payments</strong> processed monthly to your Pollo.ai affiliate account
            </li>
          </ol>
        </div>

        {/* Commission Examples */}
        <div className="mt-6 space-y-3">
          <h3 className="font-medium">Example Monthly Earnings</h3>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between rounded bg-ink-darker/50 p-3">
              <span>5 Starter referrals</span>
              <span className="font-medium text-amber">5 × $2.70 = $13.50</span>
            </div>
            <div className="flex justify-between rounded bg-ink-darker/50 p-3">
              <span>10 Pro referrals</span>
              <span className="font-medium text-amber">10 × $8.70 = $87.00</span>
            </div>
            <div className="flex justify-between rounded bg-ink-darker/50 p-3">
              <span>2 Enterprise deals</span>
              <span className="font-medium text-amber">2 × $1,000 × 0.30 = $600</span>
            </div>
            <div className="flex justify-between rounded bg-amber/20 p-3 font-medium">
              <span>Total monthly earning potential</span>
              <span className="text-amber">$700.50</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="https://pollo.ai/affiliate"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-amber flex-1"
          >
            View Pollo.ai Affiliate Dashboard ↗
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(polloAffiliateUrl)}
            className="btn-secondary flex-1"
          >
            Copy Referral Link
          </button>
        </div>
      </div>

      {/* Unstll.ai Affiliate Program */}
      <div className="card space-y-6 p-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-medium">
            🎨 Unstll.ai Affiliate Program (Coming Soon)
          </h2>
          <p className="mt-1 text-sm text-mute">
            Earn commission on Unstll.ai subscription referrals
          </p>
        </div>

        <div className="rounded border border-rail/30 bg-ink-darker/30 p-4">
          <p className="text-sm text-mute">
            We're launching our own affiliate program for Unstll.ai subscriptions.
            <br />
            Commission structure and details coming soon!
          </p>
        </div>
      </div>

      {/* Tips & Best Practices */}
      <div className="card space-y-4 p-6">
        <h2 className="font-medium">Tips for Maximizing Earnings</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium">1. Target Video Content Creators</h3>
            <p className="mt-1 text-sm text-mute">
              YouTubers, TikTok creators, and content agencies are your best customers
            </p>
          </div>

          <div>
            <h3 className="font-medium">2. Promote Your Pollo.ai Integration</h3>
            <p className="mt-1 text-sm text-mute">
              Highlight that Unstll.ai now includes Pollo.ai's 5 premium models
            </p>
          </div>

          <div>
            <h3 className="font-medium">3. Create Comparison Content</h3>
            <p className="mt-1 text-sm text-mute">
              Show Pollo.ai vs other AI video tools in your reviews or tutorials
            </p>
          </div>

          <div>
            <h3 className="font-medium">4. Target Pro Subscriptions</h3>
            <p className="mt-1 text-sm text-mute">
              Pro plans ($29/mo) are most popular and earn you $8.70 per referral
            </p>
          </div>

          <div>
            <h3 className="font-medium">5. Email Your Audience</h3>
            <p className="mt-1 text-sm text-mute">
              Send regular updates about new video generation features and capabilities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateAffiliateCode(userId) {
  // Create a simple affiliate code from user ID
  return `unstll_${userId.slice(0, 8).toUpperCase()}`;
}
