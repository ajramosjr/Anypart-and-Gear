import Marketplace from "./marketplace";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getUser();
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Seller";
  return <Marketplace user={user?.email ? { name, email: user.email } : null} signInPath="/login?next=%2F" signOutPath="/auth/signout" />;
}
