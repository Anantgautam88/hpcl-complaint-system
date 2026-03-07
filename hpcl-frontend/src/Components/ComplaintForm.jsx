import { useState } from "react";
import API from "../services/api";

function ComplaintForm() {

  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [region, setRegion] = useState("");

  const submitComplaint = async () => {

    await API.post("/complaints", {
      category,
      priority,
      region
    });

    alert("Complaint created");
  };

  return (

    <div>
      <h2>Create Complaint</h2>

      <input
        placeholder="Category"
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        placeholder="Priority"
        onChange={(e) => setPriority(e.target.value)}
      />

      <input
        placeholder="Region"
        onChange={(e) => setRegion(e.target.value)}
      />

      <button onClick={submitComplaint}>
        Submit
      </button>

    </div>

  );
}

export default ComplaintForm;