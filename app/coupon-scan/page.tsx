"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CouponScanPage() {
  const [message, setMessage] = useState("");

  const testSupabase = async () => {
    const { data, error } = await supabase
      .from("coupons")
      .select("*");

    if (error) {
      setMessage("ERROR: " + error.message);
      return;
    }

    setMessage("Coupons found: " + data.length);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Coupon Scan</h1>

      <button onClick={testSupabase}>
        Test Supabase
      </button>

      <h2>{message}</h2>
    </div>
  );
}