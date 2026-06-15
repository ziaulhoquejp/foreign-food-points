"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "@/lib/supabase";

export default function CouponUsePage() {
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] =
    useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        if (isProcessing) return;

        setIsProcessing(true);

        try {
          const parts =
            decodedText.split("/");

          const memberNo = Number(
            parts[parts.length - 1]
          );

          if (!memberNo) {
            setMessage("❌ Invalid QR");
            setIsProcessing(false);
            return;
          }

          const { data: customer } =
            await supabase
              .from("customers")
              .select("*")
              .eq("member_no", memberNo)
              .single();

          const { data, error } =
            await supabase
              .from("coupons")
              .select("*")
              .eq("member_no", memberNo)
              .eq("used", false)
              .limit(1);

          const coupon = data?.[0];

          if (error || !coupon) {
            setMessage(
              "❌ No Active Coupon Found"
            );

            setTimeout(() => {
              setIsProcessing(false);
            }, 3000);

            return;
          }

          const {
            error: updateError,
          } = await supabase
            .from("coupons")
            .update({
              used: true,
            })
            .eq("id", coupon.id);

          if (updateError) {
            setMessage(
              "❌ Coupon Update Error"
            );

            setTimeout(() => {
              setIsProcessing(false);
            }, 3000);

            return;
          }

          const { count } =
            await supabase
              .from("coupons")
              .select("*", {
                count: "exact",
                head: true,
              })
              .eq("member_no", memberNo)
              .eq("used", false);

          setMessage(
            `🎁 ${
              customer?.name || memberNo
            } Coupon Used! Remaining Coupons: ${
              count || 0
            }`
          );
        } catch (err) {
          console.error(err);

          setMessage("❌ Scan Error");
        }

        setTimeout(() => {
          setIsProcessing(false);
        }, 3000);
      },
      (error) => {
        console.log(
          "scan error:",
          error
        );
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [isProcessing]);

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <h1>
        🎁 Coupon Use Scanner
      </h1>

      <div
        id="reader"
        style={{
          marginTop: "20px",
        }}
      ></div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "#f5f5f5",
          borderRadius: "12px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        {message}
      </div>
    </div>
  );
}