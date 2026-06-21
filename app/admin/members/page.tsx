"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Member = {
  id: number;
  member_no: number;
  name: string;
  email: string;
  points: number;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // -------------------------
  // LOGOUT
  // -------------------------
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // -------------------------
  // LOAD MEMBERS
  // -------------------------
  const loadMembers = async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("member_no", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setMembers(data || []);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // -------------------------
  // ADD POINTS (SAFE)
  // -------------------------
  const addPoints = async (memberNo?: number) => {
    if (!memberNo) return;

    const { data: customer } = await supabase
      .from("customers")
      .select("*")
      .eq("member_no", memberNo)
      .single();

    if (!customer) {
      alert("Customer not found");
      return;
    }

    const newPoints = (customer.points || 0) + 10;

    const { error } = await supabase
      .from("customers")
      .update({ points: newPoints })
      .eq("member_no", memberNo);

    if (error) {
      alert("Update Error");
      return;
    }

    await loadMembers();
    alert(`Points Added: ${newPoints}`);
  };

  // -------------------------
  // ISSUE COUPON (SAFE)
  // -------------------------
  const issueCoupon = async (memberNo?: number) => {
    if (!memberNo) return;

    const { error } = await supabase
      .from("coupons")
      .insert([
        {
          member_no: memberNo,
          used: false,
        },
      ]);

    if (error) {
      alert("Coupon Error");
      return;
    }

    alert("Coupon Issued");
  };

  // -------------------------
  // FILTER SAFE
  // -------------------------
  const filteredMembers = members.filter((m) => {
    if (!m) return false;

    return (
      m.member_no?.toString().includes(searchTerm) ||
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // -------------------------
  // CSV EXPORT
  // -------------------------
  const exportCSV = () => {
    const headers = ["Member No", "Name", "Email", "Points"];

    const rows = members.map((m) => [
      m.member_no,
      m.name,
      m.email,
      m.points,
    ]);

    const csv = [headers, ...rows]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "members.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div style={{ padding: 20 }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1>Member List</h1>

        <button
          onClick={handleLogout}
          style={{
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: 8,
          }}
        >
          Logout
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search Member No / Name / Email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: 10,
          width: 300,
          marginBottom: 20,
        }}
      />

      {/* EXPORT */}
      <div>
        <button
          onClick={exportCSV}
          style={{
            background: "green",
            color: "white",
            padding: 10,
            borderRadius: 6,
          }}
        >
          Export CSV
        </button>
      </div>

      {/* TABLE */}
      <table border={1} cellPadding={10} style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Points</th>
            <th>View</th>
            <th>Add</th>
            <th>Coupon</th>
          </tr>
        </thead>

        <tbody>
          {filteredMembers.map((m) => (
            <tr key={m.id}>
              <td>{m.member_no}</td>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.points}</td>

              <td>
                <Link href={`/member/${m.member_no}`}>
                  View
                </Link>
              </td>

              <td>
                <button onClick={() => addPoints(m.member_no)}>
                  +10
                </button>
              </td>

              <td>
                <button onClick={() => issueCoupon(m.member_no)}>
                  Issue
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}