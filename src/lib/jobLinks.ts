import { JobOffer } from "@/types";

export function getJobExternalUrl(job: JobOffer): string {
  if (job.applyUrl && /^https?:\/\//i.test(job.applyUrl)) {
    return job.applyUrl;
  }
  const keywords = encodeURIComponent(`${job.title} ${job.company}`);
  const location = encodeURIComponent(job.location.split(",")[0].trim());
  return `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=${location}`;
}
