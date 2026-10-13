type Totals = { new_accounts: number; confirmed: number; signed_in: number; listed: number; messaged: number; steps: Record<string, number>; sources: Record<string, number> };
export default function SignupFunnel({ totals, unavailable }: { totals: Totals | null; unavailable: boolean }) {
  const count = (value?: number) => unavailable ? "Unavailable" : (value ?? 0).toLocaleString();
  const steps = [["visit", "Visited APG"], ["sell_intent", "Chose to sell a part"], ["contact_intent", "Opened seller contact login"], ["signup_open", "Opened create account"], ["signup_submit", "Submitted signup form"], ["signup_accepted", "Signup request accepted"], ["signup_error", "Signup error / incomplete verification"], ["signin_error", "Sign-in returned an error"]];
  return <section aria-labelledby="signup-funnel-title" className="mb-10 rounded-xl border border-slate-200 bg-white p-6">
    <h2 id="signup-funnel-title" className="text-xl font-black">Signup &amp; activity this month</h2>
    <p className="mt-2 text-sm text-slate-600">Private to administrators. New York calendar month. Browser tracking started October 13, 2026; earlier steps cannot be reconstructed.</p>
    {unavailable && <p role="status" className="mt-3 text-amber-800">Funnel counts could not be loaded. Refresh to try again.</p>}
    <h3 className="mt-6 font-bold">Estimated browser steps</h3>
    <div className="mt-3 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-2">Step</th><th className="p-2 text-right">Browsers</th></tr></thead><tbody>{steps.map(([key,label]) => <tr key={key} className="border-t border-slate-100"><th scope="row" className="p-2 font-normal">{label}</th><td className="p-2 text-right font-bold">{count(totals?.steps[key])}</td></tr>)}</tbody></table></div>
    <p className="mt-3 text-sm text-slate-600">Each browser counts once per step per month. These are separate signals, not a matched conversion rate. Common bots, automated browsers and signed-in administrators are filtered; remaining traffic may still include bots. Accepted signup requests do not prove a new account was created.</p>
    <h3 className="mt-6 font-bold">Where tracked visits came from</h3>
    <div className="mt-3 flex flex-wrap gap-3">{[["facebook","Facebook"],["instagram","Instagram"],["search","Search"],["direct","Direct / unknown"],["other","Other websites"]].map(([key,label]) => <p key={key} className="rounded-lg bg-slate-50 p-3 text-sm">{label}: <strong>{count(totals?.sources[key])}</strong></p>)}</div>
    <h3 className="mt-6 font-bold">Actual accounts created this month</h3>
    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{[["Created",totals?.new_accounts],["Email confirmed",totals?.confirmed],["Signed in",totals?.signed_in],["Posted a listing",totals?.listed],["Sent a message",totals?.messaged]].map(([label,value]) => <div key={String(label)} className="rounded-lg bg-slate-50 p-3"><p className="text-sm">{label}</p><p className="mt-2 text-2xl font-black">{count(value as number | undefined)}</p></div>)}</div>
    <p className="mt-3 text-sm text-slate-600">Account counts come from saved records and exclude administrators and anonymous accounts. Listing and message activity are independent milestones. Direct includes missing referrers. Funnel events store no IP addresses, raw URLs, emails, passwords or message contents. No tracking is perfectly bot-proof.</p>
  </section>;
}
