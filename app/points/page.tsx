"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PointsPage() {
const [id, setId] = useState("");

const addPoints = async () => {
const { data } = await supabase
.from("customers")
.select("points")
.eq("id", id)
.single();

if (!data) {
alert("Customer not found");
return;
}

await supabase
.from("customers")
.update({
points: data.points + 10,
})
.eq("id", id);

alert("+10 Points Added");
};

return (
<div style={{ padding: 20 }}>
<h1>Add Points</h1>

<input
placeholder="Customer ID"
value={id}
onChange={(e) => setId(e.target.value)}
/>

<button onClick={addPoints}>
+10 Points
</button>
</div>
);
}