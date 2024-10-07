import React, { useEffect, useState } from "react";
import Autocomplete from "./Autocomplete";  
import './EmployeeSearch.css';  

const EmployeeSearch = () => {
  const [employees, setEmployees] = useState([]); //holds all employees
  const [filteredEmployees, setFilteredEmployees] = useState([]); //holds filtered employees
  const [searchPerformed, setSearchPerformed] = useState(false); //tracks if the search button was pressed
  const [isSearchDisabled, setIsSearchDisabled] = useState(true); //disable search button if input is empty

  useEffect(() => {
    fetch("/api/employees")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
      })
      .catch((error) => console.error("Error fetching employee data:", error));
  }, []);

  //handle search button click
  const handleSearch = () => {
    setSearchPerformed(true); 
    //if no filtered employees are found, show the full employee list
    if (filteredEmployees.length === 0) {
      setFilteredEmployees(employees);  
    }
  };

  //reset search state when input is cleared
  const resetSearch = () => {
    setSearchPerformed(false);  
    setFilteredEmployees([]);   
  };

  return (
    <div className="employee-search-container">
      <div className="search-header">
        <h1>{searchPerformed ? "Search result" : "LOOKING FOR AN EMPLOYEE?"}</h1>
        {!searchPerformed && <p>Click on the search bar to learn our suggestions</p>}

        <div className="search-bar-container">
          <Autocomplete 
            employees={employees} 
            setFilteredEmployees={setFilteredEmployees} 
            searchPerformed={searchPerformed}  
            resetSearch={resetSearch}       
            setIsSearchDisabled={setIsSearchDisabled}  
          />
          <button 
            className="search-button" 
            onClick={handleSearch} 
            disabled={isSearchDisabled} //disable search button if input is empty
          >
            Search
          </button>
        </div>
      </div>

      {/* conditionally render search results */}
      {searchPerformed && filteredEmployees.length > 0 && (
        <div className="results-container">
          <ul>
            {filteredEmployees.map((employee) => (
              <li key={employee.name}>
                <img src={employee.imageUrl} alt={employee.name} style={{ width: "60px", height: "60px" }} />
                <p>{employee.name} - {employee.workTitle}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmployeeSearch;
