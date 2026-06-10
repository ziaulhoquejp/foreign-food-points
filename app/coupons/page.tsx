"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Coupon = {
  id: string;
  member_no: number;
  used: boolean;
  created_at: string;
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const fetchCoupons = async () => {
    const { data } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setCoupons(data);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // 🔥 使用処理
  const useCoupon = async (id: string) => {
    const { error } = await supabase
      .from("coupons")
      .update({ used: true })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchCoupons(); // 再読み込み
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Coupons</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Member No</th>
            <th className="p-2 border">Used</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {coupons.map((c) => (
            <tr key={c.id}>
              <td className="p-2 border">{c.member_no}</td>
              <td className="p-2 border">
                {c.used ? "USED" : "ACTIVE"}
              </td>
              <td className="p-2 border">
                {new Date(c.created_at).toLocaleString()}
              </td>

              <td className="p-2 border">
                {!c.used && (
                  <button
                    onClick={() => useCoupon(c.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Use
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}