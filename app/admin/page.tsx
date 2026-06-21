"use client";

import Link from "next/link";

export default function AdminPage() {
return (
<div style={{ padding: 30 }}> <h1>Admin Dashboard</h1>


  <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
    <Link href="/admin/members">
      <button>Members</button>
    </Link>

    <Link href="/scan">
      <button>QR Scan</button>
    </Link>

    <Link href="/history">
      <button>History</button>
    </Link>

    <Link href="/coupon-use">
      <button>Coupons</button>
    </Link>
  </div>
</div>


);
}
