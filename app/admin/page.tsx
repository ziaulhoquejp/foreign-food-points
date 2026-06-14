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
<div style={{ padding: "30px" }}> <h1>👤 Member Profile</h1>


  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "20px",
    }}
  >
    <h2>{member.name}</h2>

    <p>
      <strong>Member No:</strong>{" "}
      {member.member_no}
    </p>

    <p>
      <strong>Email:</strong>{" "}
      {member.email}
    </p>

    <p>
      <strong>Points:</strong>{" "}
      {member.points}
    </p>
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
            padding: "10px",
            borderBottom:
              "1px solid #eee",
          }}
        >
          Coupon #{coupon.id}
          {" - "}
          {coupon.used
            ? "Used"
            : "Available"}
        </div>
      ))
    )}
  </div>
</div>


);
}
