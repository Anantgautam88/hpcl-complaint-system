import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {

    API.get("/admin/dashboard")
      .then(res => setData(res.data));

  }, []);

  if (!data) return <p>Loading...</p>;

  return (

    <div>

      <h2>Admin Dashboard</h2>

      <p>Total Complaints: {data.total_complaints}</p>
      <p>Pending: {data.pending_complaints}</p>
      <p>Escalated: {data.escalated_complaints}</p>
      <p>Resolved: {data.resolved_complaints}</p>

    </div>

  );
}

export default Dashboard;