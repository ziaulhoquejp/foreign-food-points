"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLayout({
children,
}: {
children: React.ReactNode;
}) {
const router = useRouter();
const [loading, setLoading] = useState(true);

useEffect(() => {
const checkUser = async () => {
const {
data: { session },
} = await supabase.auth.getSession();


  if (!session) {
    router.push("/login");
    return;
  }

  setLoading(false);
};

checkUser();


}, [router]);

if (loading) {
return <div>Loading...</div>;
}

return <>{children}</>;
}
