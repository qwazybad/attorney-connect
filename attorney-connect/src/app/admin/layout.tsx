import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  const adminIds = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!userId) {
    redirect("/attorney-portal/sign-in?redirect_url=%2Fadmin");
  }

  if (!adminIds.includes(userId)) {
    redirect("/");
  }

  return <>{children}</>;
}
