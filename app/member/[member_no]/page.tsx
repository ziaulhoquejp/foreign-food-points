"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MemberPage({
params,
}: {
params: Promise<{ member_no: string }>;
}) {
const { member_no } = use(params);

const [customer, setCustomer] = useState<any>(null);
const [couponCount, setCouponCount] = useState(0);
const [usedCouponCount, setUsedCouponCount] = useState(0);
const [visits, setVisits] = useState<any[]>([]);

useEffect(() => {
loadData();
}, []);

const loadData = async () => {
const memberNo = Number(member_no);


const { data: customerData } = await supabase
  .from("customers")
  .select("*")
  .eq("member_no", memberNo)
  .single();

setCustomer(customerData);

const { data: activeCoupons } = await supabase
  .from("coupons")
  .select("*")
  .eq("member_no", memberNo)
  .eq("used", false);

const { data: usedCoupons } = await supabase
  .from("coupons")
  .select("*")
  .eq("member_no", memberNo)
  .eq("used", true);

setCouponCount(activeCoupons?.length || 0);
setUsedCouponCount(usedCoupons?.length || 0);

const { data: visitData } = await supabase
  .from("scan_logs")
  .select("*")
  .eq("member_no", memberNo)
  .order("created_at", { ascending: false });

setVisits(visitData || []);


};

if (!customer) {
  return (
    <div style={{ padding: 20 }}>
      Loading...
    </div>
  );
}




const points = customer.points || 0;

let rank = "Bronze";

if (points >= 1000) {
rank = "Platinum";
} else if (points >= 500) {
rank = "Gold";
} else if (points >= 100) {
rank = "Silver";
}

const nextCouponTarget = 500;
const remainingPoints = Math.max(
nextCouponTarget - points,
0
);

return (
<div style={{ padding: 20 }}> <h1>Member Page</h1>


  <div
  style={{
    background:
      "linear-gradient(135deg,#1e3a8a,#2563eb)",
    color: "white",
    padding: "25px",
    borderRadius: "16px",
    marginBottom: "20px",
  }}
>
  <h2>{customer.name}</h2>

  <p>
    Member No: {customer.member_no}
  </p>

  <p>{customer.email}</p>

  <h1
    style={{
      fontSize: "48px",
      margin: "10px 0",
    }}
  >
    ⭐ {points}
  </h1>

  <p>{rank} Member</p>
</div>

  <hr />

  <div
  style={{
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  }}
>
  <h3>🏆 Member Status</h3>

  <p>Rank: {rank}</p>

  <p>Total Visits: {visits.length}</p>

  <p>
    Next Coupon Target:
    {nextCouponTarget}
  </p>

  <p>
    Remaining Points:
    {remainingPoints}
  </p>
</div>

  <hr />

  <div
  style={{
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  }}
>
  <h3>🎁 Coupons</h3>

  <p>
    Active Coupons:
    {couponCount}
  </p>

  <p>
    Used Coupons:
    {usedCouponCount}
  </p>
</div>

  <p>Active Coupons: {couponCount}</p>
  <p>Used Coupons: {usedCouponCount}</p>

  <hr />

  <h3>Recent Visits</h3>

  {visits.length === 0 ? (
    <p>No visits yet</p>
  ) : (
    <ul>
      {visits.map((visit) => (
        <li key={visit.id}>
          {new Date(
            visit.created_at
          ).toLocaleString("ja-JP")}
        </li>
      ))}
    </ul>
  )}
</div>


);
}
