import { BadgeCheck, Building2, MailCheck } from "lucide-react";

type SellerBadgesProps = {
  emailVerified?: boolean;
  trustedSeller?: boolean;
  verifiedBusiness?: boolean;
};

export default function SellerBadges({ emailVerified, trustedSeller, verifiedBusiness }: SellerBadgesProps) {
  if (!emailVerified && !trustedSeller && !verifiedBusiness) return null;

  return (
    <span className="seller-badges" aria-label="Seller verification badges">
      {emailVerified && <span className="verified-badge email-badge" title="Email address confirmed"><MailCheck className="size-3" /> Email Verified</span>}
      {trustedSeller && <span className="verified-badge trusted-badge" title="Completed sale with a positive verified review"><BadgeCheck className="size-3" /> Trusted Seller</span>}
      {verifiedBusiness && <span className="verified-badge business-badge" title="Business verified by Any Part & Gear"><Building2 className="size-3" /> Verified Business</span>}
    </span>
  );
}
