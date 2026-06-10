"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CustomersPage() {
const [customers, setCustomers] = useState<any[]>([]);

const loadCustomers = async () => {
const { data, error } = await supabase
.from("customers")
.select("*");

if (!error && data) {
setCustomers(data);
}
};

useEffect(() => {
loadCustomers();
}, []);

const addPoints = async (id: string, currentPoints: number) => {
const { error } = await supabase
.from("customers")
.update({
points: currentPoints + 10,
})
.eq("id", id);

if (error) {
alert(error.message);
return;
}

await loadCustomers();
};

return (
<div style={{ padding: "20px" }}>
<h1>Customers</h1>

<table border={1} cellPadding={10}>
<thead>
<tr>
<th>Member No</th>
<th>Name</th>
<th>Email</th>
<th>Points</th>
<th>Action</th>
</tr>
</thead>

<tbody>
{customers.map((customer) => (
<tr key={customer.id}>
<td>{customer.member_no}</td>
<td>{customer.name}</td>
<td>{customer.email}</td>
<td>{customer.points}</td>
<td>
<button
onClick={() =>
addPoints(customer.id, customer.points)
}
>
+10 Points
</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
);
}