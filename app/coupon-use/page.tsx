"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "@/lib/supabase";

export default function CouponUsePage() {
const [message, setMessage] = useState("");

useEffect(() => {
const scanner = new Html5QrcodeScanner(
"reader",
{ fps: 10, qrbox: 250 },
false
);


scanner.render(
  async (decodedText) => {
    try {
      console.log("decodedText:", decodedText);

      const parts = decodedText.split("/");
      const memberNo = Number(parts[parts.length - 1]);

      console.log("memberNo:", memberNo);

      if (!memberNo) {
        setMessage("Invalid QR");
        return;
      }

      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("member_no", memberNo)
        .eq("used", false)
        .limit(1);

      console.log("coupon data:", data);
      console.log("coupon error:", error);

      const coupon = data?.[0];

      if (error || !coupon) {
        setMessage("No active coupon found");
        return;
      }

      const { error: updateError } = await supabase
        .from("coupons")
        .update({ used: true })
        .eq("id", coupon.id);

      if (updateError) {
        setMessage("Update Error");
        return;
      }

      setMessage("Coupon USED for Member " + memberNo);
    } catch (e) {
      console.error(e);
      setMessage("Scan Error");
    }
  },
  (error) => {
    console.log("scan error:", error);
  }
);

return () => {
  scanner.clear().catch(() => {});
};


}, []);

return (
<div style={{ padding: 20 }}> <h1>Coupon Use Scan</h1>


  <div id="reader"></div>

  <h2>{message}</h2>
</div>


);
}
