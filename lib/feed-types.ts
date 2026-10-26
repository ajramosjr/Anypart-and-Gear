export type FeedCategory = "For sale" | "Projects" | "Questions" | "Updates";
export type FeedItem = {
  id: string; kind: "listing" | "post"; userId: string; author: string; avatar: string | null;
  title: string; body: string; category: FeedCategory; images: string[]; createdAt: string;
  price?: number; location?: string; condition?: string; listingCategory?: string;
  likes: number; replies: number; liked: boolean; saved: boolean;
};
export type FeedReply = {id: string; userId: string; author: string; body: string; createdAt: string};
export type FeedPage = {items: FeedItem[]; hasMore: boolean};
export type FeedMember = {id:string; name:string; isAdmin:boolean} | null;
