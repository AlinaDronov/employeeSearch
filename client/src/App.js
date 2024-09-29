import React from "react";
import "./App.css";
import EmployeeSearch from "./components/EmployeeSearch";  // Import the EmployeeSearch component

function App() {
  return (
    <div className="App">
        <img src="https://1000logos.net/wp-content/uploads/2019/08/Deloitte-Logo-2003.png" alt="Deloitte Logo" className="app-logo" />
      <EmployeeSearch />
    </div>
  );
}

export default App;

