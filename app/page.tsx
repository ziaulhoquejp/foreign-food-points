"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function HomePage() {
  const router = useRouter();

  const [language, setLanguage] = useState<"en" | "ja" | "bn" | "np">("en");
  const [loading, setLoading] = useState(true);

  const [memberCount, setMemberCount] = useState(0);
  const [couponCount, setCouponCount] = useState(0);
  const [scanCount, setScanCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [unusedCoupons, setUnusedCoupons] = useState(0);
  const [todayScans, setTodayScans] = useState(0);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [topMembers, setTopMembers] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const translations = {
    en: { title: "Foreign Food Points System", subtitle: "QR Platform" },
    ja: { title: "ポイント管理システム", subtitle: "QR管理" },
    bn: { title: "পয়েন্ট সিস্টেম", subtitle: "QR প্ল্যাটফর্ম" },
    np: { title: "पोइन्ट सिस्टम", subtitle: "QR सिस्टम" },
  };

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      const { count: members } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      const { count: coupons } = await supabase
        .from("coupons")
        .select("*", { count: "exact", head: true });

      const { count: scans } = await supabase
        .from("scan_logs")
        .select("*", { count: "exact", head: true });

      const { data: pointsData } = await supabase
        .from("customers")
        .select("points");

      const total =
        pointsData?.reduce((sum, r) => sum + (r.points || 0), 0) || 0;

      const { count: unused } = await supabase
        .from("coupons")
        .select("*", { count: "exact", head: true })
        .eq("used", false);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count: todayCount } = await supabase
        .from("scan_logs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString());

      setMemberCount(members || 0);
      setCouponCount(coupons || 0);
      setScanCount(scans || 0);
      setTotalPoints(total);
      setUnusedCoupons(unused || 0);
      setTodayScans(todayCount || 0);

      const { data: recent } = await supabase
        .from("scan_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentLogs(recent || []);

      const { data: top } = await supabase
        .from("customers")
        .select("*")
        .order("points", { ascending: false })
        .limit(5);

      setTopMembers(top || []);

      const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      const weekly = days.map(d => ({ day: d, scans: 0 }));

      const { data: logs } = await supabase
        .from("scan_logs")
        .select("created_at");

      logs?.forEach(l => {
        const d = new Date(l.created_at);
        const day = days[d.getDay()];
        const target = weekly.find(x => x.day === day);
        if (target) target.scans++;
      });

      setChartData(weekly);

    } catch (error) {
      console.error("LOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 40, background: "#f5f7fa", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>🍜 {translations[language].title}</h1>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

      <p>{translations[language].subtitle}</p>

      <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
        <div>Members: {memberCount}</div>
        <div>Coupons: {couponCount}</div>
        <div>Scans: {scanCount}</div>
        <div>Total Points: {totalPoints}</div>
      </div>

      <div style={{ height: 300, marginTop: 30 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="scans" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}