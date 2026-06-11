"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function MembersPage() {
const [members, setMembers] = useState<any[]>([]);
const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
loadMembers();
}, []);

const loadMembers = async () => {
const { data } = await supabase
.from("customers")
.select("*")
.order("member_no", { ascending: true });


setMembers(data || []);


};

const addPoints = async (
memberNo: number
) => {
const { data: customer } =
await supabase
.from("customers")
.select("*")
.eq("member_no", memberNo)
.single();


if (!customer) {
  alert("Customer not found");
  return;
}

const newPoints =
  (customer.points || 0) + 10;

const { error: updateError } =
  await supabase
    .from("customers")
    .update({
      points: newPoints,
    })
    .eq("member_no", memberNo);

if (updateError) {
  alert("Update Error");
const filteredMembers = members.filter(
  (member) =>
    member.member_no
      ?.toString()
      .includes(searchTerm) ||
    member.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    member.email
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
);  return;
}

if (newPoints >= 500) {
  await supabase
    .from("coupons")
    .insert([
      {
        member_no: memberNo,
        used: false,
      },
    ]);

  alert(
    "🎉 500 Points Reached! Coupon Issued!"
  );
} else {
  alert(
    "Points Added. Total: " +
      newPoints
  );
}

await loadMembers();


};

const issueCoupon = async (
memberNo: number
) => {
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
  console.log(error);
  return;
}

alert(
  "Coupon Issued for Member " +
    memberNo
);


};

return (
<div style={{ padding: 20 }}> <h1>Member List</h1>
<div style={{ marginBottom: "20px" }}>
  <input
    type="text"
    placeholder="Search Member No / Name / Email"
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
    style={{
      padding: "10px",
      width: "300px",
      border: "1px solid #ccc",
      borderRadius: "6px",
    }}
  />
</div>

  <table
    border={1}
    cellPadding={10}
    style={{
      borderCollapse: "collapse",
    }}
  >
    <thead>
      <tr>
        <th>Member No</th>
        <th>Name</th>
        <th>Email</th>
        <th>Points</th>
        <th>Action</th>
        <th>Points Action</th>
        <th>Coupon Action</th>
      </tr>
    </thead>

    <tbody>
      {filteredMembers.map((member) => (
        <tr key={member.id}>
          <td>{member.member_no}</td>
          <td>{member.name}</td>
          <td>{member.email}</td>
          <td>{member.points}</td>

          <td>
            <Link
              href={`/member/${member.member_no}`}
            >
              View
            </Link>
          </td>

          <td>
            <button
              onClick={() =>
                addPoints(
                  member.member_no
                )
              }
            >
              +10 Points
            </button>
          </td>

          <td>
            <button
              onClick={() =>
                issueCoupon(
                  member.member_no
                )
              }
            >
              Issue Coupon
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


);
}
