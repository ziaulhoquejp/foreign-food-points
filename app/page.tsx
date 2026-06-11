"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
const [memberCount, setMemberCount] = useState(0);
const [couponCount, setCouponCount] = useState(0);
const [scanCount, setScanCount] = useState(0);

useEffect(() => {
loadStats();
}, []);

const loadStats = async () => {
const { count: members } = await supabase
.from("customers")
.select("*", { count: "exact", head: true });


const { count: coupons } = await supabase
  .from("coupons")
  .select("*", { count: "exact", head: true });

const { count: scans } = await supabase
  .from("scan_logs")
  .select("*", { count: "exact", head: true });

setMemberCount(members || 0);
setCouponCount(coupons || 0);
setScanCount(scans || 0);


};

return (
<div
style={{
minHeight: "100vh",
padding: "40px",
background: "#f5f7fa",
}}
>
<h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
🍜 Foreign Food Points System </h1>


  <p style={{ fontSize: "18px", color: "#555" }}>
    QR-Based Customer Loyalty Platform
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: "20px",
      marginTop: "30px",
    }}
  >
    <div style={statsCard}>
      <h3>👥 Members</h3>
      <h1>{memberCount}</h1>
    </div>

    <div style={statsCard}>
      <h3>🎁 Coupons</h3>
      <h1>{couponCount}</h1>
    </div>

    <div style={statsCard}>
      <h3>📊 Scan Records</h3>
      <h1>{scanCount}</h1>
    </div>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: "20px",
      marginTop: "40px",
    }}
  >
    <Link href="/admin/members">
      <div style={cardStyle}>
        <h2>👥 Members</h2>
        <p>Manage registered customers</p>
      </div>
    </Link>

    <Link href="/scan">
      <div style={cardStyle}>
        <h2>📱 QR Scan</h2>
        <p>Add points by scanning QR codes</p>
      </div>
    </Link>

    <Link href="/coupon-use">
      <div style={cardStyle}>
        <h2>🎁 Coupons</h2>
        <p>Redeem customer coupons</p>
      </div>
    </Link>

    <Link href="/history">
      <div style={cardStyle}>
        <h2>📊 History</h2>
        <p>View scan activity logs</p>
      </div>
    </Link>
  </div>

  <div
    style={{
      marginTop: "50px",
      padding: "20px",
      background: "white",
      borderRadius: "12px",
    }}
  >
    <h3>System Overview</h3>

    <ul>
      <li>Customer Registration</li>
      <li>QR Code Membership System</li>
      <li>Point Collection</li>
      <li>Automatic Coupon Issuance</li>
      <li>Coupon Redemption</li>
      <li>Scan History Tracking</li>
      <li>Supabase Database</li>
      <li>GitHub + Vercel Deployment</li>
    </ul>
  </div>
</div>


);
}

const cardStyle = {
background: "white",
padding: "20px",
borderRadius: "12px",
boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
cursor: "pointer",
};

const statsCard = {
background: "#ffffff",
padding: "20px",
borderRadius: "12px",
textAlign: "center" as const,
boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};
