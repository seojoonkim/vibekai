import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NotificationsList } from "./notifications-list";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: notifications, count } = await supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(0, 19);

  return (
    <div className="container max-w-2xl py-8 px-4">
      <h1 className="text-2xl font-bold text-[#c9d1d9] mb-6">알림</h1>
      <NotificationsList
        initialNotifications={notifications ?? []}
        initialTotal={count ?? 0}
      />
    </div>
  );
}
