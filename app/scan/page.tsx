"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "@/lib/supabase";

export default function ScanPage() {
const [message, setMessage] = useState("");
const [isProcessing, setIsProcessing] = useState(false);

useEffect(() => {
const scanner = new Html5QrcodeScanner(
"reader",
{ fps: 10, qrbox: 250 },
false
);

scanner.render(async (decodedText) => {
  if (isProcessing) return;

  setIsProcessing(true);

  try {
    const url = new URL(decodedText);
    const memberNo = Number(url.pathname.split("/").pop());

    if (!memberNo) {
      setMessage("❌ Invalid QR");
      return;
    }

    // 1日1回チェック
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: existingScan } = await supabase
      .from("scan_logs")
      .select("*")
      .eq("member_no", memberNo)
      .gte("created_at", today.toISOString());

    if (existingScan && existingScan.length > 0) {
      setMessage("⚠️ Already scanned today");
      return;
    }

    // 顧客取得
    const { data: customer, error } = await supabase
      .from("customers")
      .select("*")
      .eq("member_no", memberNo)
      .single();

    if (error || !customer) {
      setMessage("❌ Member not found");
      return;
    }

    // ポイント加算
    const currentPoints = customer.points || 0;
    const newPoints = currentPoints + 10;

    await supabase
      .from("customers")
      .update({ points: newPoints })
      .eq("member_no", memberNo);

    // scan履歴保存
    const { error: logError } = await supabase
  .from("scan_logs")
  .insert([
    {
      member_no: memberNo,
      points_added: 10,
    },
  ]);

if (logError) {
  setMessage(`LOG ERROR: ${logError.message}`);
  return;
}

    // 100ポイントごとにクーポン発行
    if (newPoints % 100 === 0) {
      await supabase
        .from("coupons")
        .insert([
          {
            member_no: memberNo,
            used: false,
          },
        ]);

      setMessage(
        `🎉 Coupon Issued! Current Points: ${newPoints}`
      );
    } else {
      setMessage(
        `✅ +10 Points Added! Current Points: ${newPoints}`
      );
    }
  } catch (err) {
    console.error(err);
    setMessage("❌ Scan Error");
  }

  setTimeout(() => {
    setIsProcessing(false);
  }, 3000);
});

return () => {
  scanner.clear().catch(() => {});
};

}, [isProcessing]);

return (
<div style={{ padding: 20 }}>
QR Scan

  <div id="reader"></div>

  <h2>{message}</h2>
</div>

);
}