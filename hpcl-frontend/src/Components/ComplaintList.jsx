import { useEffect, useState } from "react";
import API from "../services/api";

function ComplaintList() {

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {

    const res = await API.get("/complaints");

    setComplaints(res.data);

  };

  return (

    <div>

      <h2>Complaints</h2>

      {complaints.map(c => (

        <div key={c.id}>

          <p>Category: {c.category}</p>
          <p>Status: {c.status}</p>
          <p>Assigned: {c.assigned_to}</p>

        </div>

      ))}

    </div>

  );
}

export default ComplaintList;