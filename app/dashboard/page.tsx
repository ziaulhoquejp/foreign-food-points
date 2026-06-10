"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [coupons, setCoupons] = useState(0);
  const [usedCoupons, setUsedCoupons] = useState(0);
  const [todayScans, setTodayScans] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // 👤 顧客数
      const { count: customerCount } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      // 💰 総ポイント
      const { data: customers } = await supabase
        .from("customers")
        .select("points");

      const total = customers?.reduce((sum, c) => sum + (c.points || 0), 0);

      // 🎟 クーポン数
      const { count: couponCount } = await supabase
        .from("coupons")
        .select("*", { count: "exact", head: true });

      // ✔ 使用済みクーポン
      const { count: usedCount } = await supabase
        .from("coupons")
        .select("*", { count: "exact", head: true })
        .eq("used", true);

      // 📊 今日のスキャン数
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count: scanCount } = await supabase
        .from("scan_logs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString());

      setTotalCustomers(customerCount || 0);
      setTotalPoints(total || 0);
      setCoupons(couponCount || 0);
      setUsedCoupons(usedCount || 0);
      setTodayScans(scanCount || 0);
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <Card title="Customers" value={totalCustomers} />
        <Card title="Total Points" value={totalPoints} />
        <Card title="Coupons" value={coupons} />
        <Card title="Used Coupons" value={usedCoupons} />
        <Card title="Today Scans" value={todayScans} />
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="p-4 bg-white shadow rounded-xl">
      <h2 className="text-gray-500">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}