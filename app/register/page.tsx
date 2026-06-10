"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    const { data: lastCustomer } = await supabase
      .from("customers")
      .select("member_no")
      .order("member_no", { ascending: false })
      .limit(1)
      .single();

    const nextMemberNo = lastCustomer
      ? lastCustomer.member_no + 1
      : 1001;

    const { error } = await supabase.from("customers").insert([
      {
        name,
        email,
        member_no: nextMemberNo,
        points: 0,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert(`Customer Registered! Member No: ${nextMemberNo}`);

    setName("");
    setEmail("");

    // 👉 登録後に会員証へ移動
    router.push(`/member/${nextMemberNo}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Register Page</h1>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}