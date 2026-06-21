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

    const onScanSuccess = async (decodedText: string) => {
      if (isProcessing) return;

      setIsProcessing(true);

      try {
        const parts = url.pathname.split("/");
const last = parts[parts.length - 1];

const memberNo = last ? Number(last) : null;

if (!memberNo || isNaN(memberNo)) {
  setMessage("❌ Invalid QR");
  return;
}

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

        const { data: customer, error } = await supabase
          .from("customers")
          .select("*")
          .eq("member_no", memberNo)
          .single();

        if (error || !customer) {
          setMessage("❌ Member not found");
          return;
        }

        const newPoints = (customer.points || 0) + 10;

        await supabase
          .from("customers")
          .update({ points: newPoints })
          .eq("member_no", memberNo);

        await supabase.from("scan_logs").insert([
          {
            member_no: memberNo,
            points_added: 10,
          },
        ]);

        if (newPoints % 500 === 0) {
          await supabase.from("coupons").insert([
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
            `✅ +10 Points! Current: ${newPoints}`
          );
        }
      } catch (err) {
        console.error(err);
        setMessage("❌ Scan Error");
      } finally {
        setTimeout(() => {
          setIsProcessing(false);
        }, 2000);
      }
    };

    scanner.render(onScanSuccess, (error) => {
      console.log("scan error:", error);
    });

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [isProcessing]);

  return (
    <div style={{ padding: 20 }}>
      <h1>QR Scan</h1>
      <div id="reader" />
      <h2>{message}</h2>
    </div>
  );
}