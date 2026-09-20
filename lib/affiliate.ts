export const AMAZON_ASSOCIATE_TAG = "anypartandgea-20";

export function amazonSearchUrl(query: string) {
  const params = new URLSearchParams({
    k: query,
    tag: AMAZON_ASSOCIATE_TAG,
  });
  return `https://www.amazon.com/s?${params.toString()}`;
}
