"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HistoryPage() {
const [logs, setLogs] = useState<any[]>([]);
const [error, setError] = useState("");

useEffect(() => {
loadHistory();
}, []);

const loadHistory = async () => {
const { data, error } = await supabase
.from("scan_logs")
.select("*")
.order("created_at", { ascending: false });


if (error) {
  setError(error.message);
  return;
}

setLogs(data || []);


};

if (error) {
return <div>Error: {error}</div>;
}

return (
<div style={{ padding: 20 }}> <h1>Scan History</h1>


  <table border={1} cellPadding={10}>
    <thead>
      <tr>
        <th>ID</th>
        <th>Member No</th>
        <th>Points</th>
        <th>Date</th>
      </tr>
    </thead>

    <tbody>
      {logs.map((log) => (
        <tr key={log.id}>
          <td>{log.id}</td>
          <td>{log.member_no}</td>
          <td>+{log.points_added}</td>
          <td>
            {new Date(
              log.created_at
            ).toLocaleString()}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


);
}
