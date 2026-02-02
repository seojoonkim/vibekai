import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateStreak, getStreak } from "@/lib/streak";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await updateStreak(user.id);
  return NextResponse.json(result);
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await getStreak(user.id);
  return NextResponse.json(result);
}
