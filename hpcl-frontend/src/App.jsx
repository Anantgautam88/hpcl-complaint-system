import ComplaintForm from "./Components/ComplaintForm.jsx";
import ComplaintList from "./Components/ComplaintList.jsx";
import Dashboard from "./Components/Dashboard.jsx";

function App() {

  return (

    <div>

      <h1>HPCL Complaint System</h1>

      <Dashboard />

      <ComplaintForm />

      <ComplaintList />

    </div>

  );
}

export default App;