import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().trim().min(3).max(120),
  location: z.string().trim().min(2).max(120),
  field: z.enum(["Automotive", "Marine", "Motorcycle", "Machinery", "Parts & Warehouse", "Other"]),
  schedule: z.enum(["Full-time", "Part-time", "Apprenticeship", "Temporary"]),
  pay_range: z.string().trim().min(2).max(120),
  description: z.string().trim().min(20).max(5000),
  application_method: z.enum(["email", "website"]),
  application_contact: z.string().trim().max(300),
}).superRefine((job, ctx) => {
  const valid = job.application_method === "email"
    ? z.string().email().safeParse(job.application_contact).success
    : (() => { try { const url = new URL(job.application_contact); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; } })();
  if (!valid) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["application_contact"], message: "Enter a valid email address or an HTTPS application link." });
});
export type JobInput = z.infer<typeof jobSchema>;
export type Job = JobInput & { id: string; shop_id: string; status: string; expires_at: string; created_at: string; shops?: { name: string } | null };
export const jobFields = ["Automotive", "Marine", "Motorcycle", "Machinery", "Parts & Warehouse", "Other"];
export const jobSchedules = ["Full-time", "Part-time", "Apprenticeship", "Temporary"];
export function applicationHref(job: Job) {
  if (job.application_method === "email" && z.string().email().safeParse(job.application_contact).success) return `mailto:${job.application_contact}?subject=${encodeURIComponent(`Application: ${job.title}`)}`;
  try { const url = new URL(job.application_contact); if (url.protocol === "https:" && !url.username && !url.password) return url.toString(); } catch {}
  return null;
}
