type Business = { id: string; name: string; is_verified: boolean; is_active: boolean };

/** Render only inside the server-authorized admin dashboard. No mutation controls. */
export default function HiringButtonPreview({ businesses }: { businesses: Business[] }) {
  const eligible = businesses.filter(business => business.is_verified && business.is_active);
  return <section aria-labelledby="hiring-preview-title" className="mb-10 rounded-xl border border-slate-200 bg-white p-6">
    <h2 id="hiring-preview-title" className="text-xl font-black">Business hiring — read-only preview</h2>
    <p className="mt-2 text-slate-600">These are the buttons an approved business owner sees. Preview buttons are disabled and cannot create or change a job.</p>
    {eligible.length ? <div className="mt-4 grid gap-4 sm:grid-cols-2">{eligible.map(business => <article key={business.id} className="rounded-lg border border-slate-200 p-4">
      <h3 className="font-bold">{business.name}</h3>
      <p className="mt-1 text-sm text-slate-600">Active, administrator-approved business</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" disabled className="button button-small" aria-describedby="hiring-preview-note">Post a Job</button>
        <button type="button" disabled className="button button-small button-secondary" aria-describedby="hiring-preview-note">Manage Job Openings</button>
      </div>
    </article>)}</div> : <p className="mt-4 text-slate-600">No active, approved businesses are available to preview.</p>}
    <p id="hiring-preview-note" className="mt-4 text-sm text-slate-600">Visitors see “Now Hiring” only when the business has an active opening. This preview does not indicate whether a business is currently hiring.</p>
  </section>;
}
