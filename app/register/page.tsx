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

router.push(`/member/${nextMemberNo}`);


};

return (
<div
style={{
minHeight: "100vh",
background: "#f5f7fa",
display: "flex",
justifyContent: "center",
alignItems: "center",
padding: "20px",
}}
>
<div
style={{
background: "white",
padding: "30px",
borderRadius: "16px",
width: "100%",
maxWidth: "400px",
boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
}}
>
<h1
style={{
textAlign: "center",
marginBottom: "10px",
}}
>
🎁 Join Shizuoka Mart Rewards </h1>


    <p
      style={{
        textAlign: "center",
        color: "#666",
        marginBottom: "25px",
      }}
    >
      Register free and start collecting points.
    </p>

    <input
      type="text"
      placeholder="Your Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid #ddd",
      }}
    />

    <input
      type="email"
      placeholder="Email Address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "20px",
        borderRadius: "8px",
        border: "1px solid #ddd",
      }}
    />

    <button
      onClick={handleRegister}
      style={{
        width: "100%",
        padding: "14px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
      }}
    >
      Register Now
    </button>
  </div>
</div>


);
}
