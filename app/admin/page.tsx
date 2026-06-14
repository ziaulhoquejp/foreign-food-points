"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MemberPage({
params,
}: {
params: { member_no: string };
}) {
const [member, setMember] = useState<any>(null);
const [coupons, setCoupons] = useState<any[]>([]);

useEffect(() => {
loadMember();
}, []);

const loadMember = async () => {
const { data: customer } = await supabase
.from("customers")
.select("*")
.eq("member_no", params.member_no)
.single();


setMember(customer);

const { data: couponData } = await supabase
  .from("coupons")
  .select("*")
  .eq("member_no", params.member_no);

setCoupons(couponData || []);


};

if (!member) {
return <div style={{ padding: 20 }}>Loading...</div>;
}

return (
  <div
    style={{
      minHeight: "100vh",
      background: "#f5f7fa",
      padding: "20px",
    }}
  > <h1>🚀 NEW MEMBER PROFILE</h1>


  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "20px",
    }}
  >
    <div
  style={{
    background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
    color: "white",
    padding: "25px",
    borderRadius: "16px",
  }}
>
  <h2 style={{ margin: 0 }}>
    {member.name}
  </h2>

  <p>
    Member No: {member.member_no}
  </p>

  <h1
    style={{
      fontSize: "48px",
      margin: "10px 0",
    }}
  >
    ⭐ {member.points}
  </h1>

  <p>Current Points</p>
</div>
  </div>

  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "20px",
    }}
  >
    <h2>🎁 Coupons</h2>

    {coupons.length === 0 ? (
      <p>No coupons available</p>
    ) : (
      coupons.map((coupon) => (
        <div
  key={coupon.id}
  style={{
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "10px",
    background: coupon.used
      ? "#e5e7eb"
      : "#dcfce7",
  }}
>
  🎁 Coupon #{coupon.id}

  <br />

  Status:
  {coupon.used
    ? " Used"
    : " Available"}
</div>
      ))
    )}
  </div>
</div>


);
}
