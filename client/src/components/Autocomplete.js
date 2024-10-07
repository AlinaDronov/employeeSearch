import React, { useState, useRef } from 'react';
import './Autocomplete.css';

const Autocomplete = ({ employees, setFilteredEmployees, searchPerformed, resetSearch, setIsSearchDisabled }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); //tracks the highlighted suggestion index
  const suggestionRefs = useRef([]); 
  const autocompleteRef = useRef(null); 

  //handle focus event to show all employees if input is empty
  const handleFocus = () => {
    if (inputValue.length === 0) {
      setSuggestions(employees);  
    }
  };

  //handle blur event to close the suggestions if focus is lost
  const handleBlur = (event) => {
    if (autocompleteRef.current && !autocompleteRef.current.contains(event.relatedTarget)) {
      setSuggestions([]);
    }
  };

  //function to handle employee selection (for both click and Enter key)
  const selectEmployee = (employee) => {
    setInputValue(employee.name);  
    setFilteredEmployees([employee]);  
    setSuggestions([]); 
    setIsSearchDisabled(false); 
  };

  //handle input change and suggest matching employees
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    setHighlightedIndex(-1);

    //if the input is cleared, disable the search button and reset search
    if (value === '') {
      resetSearch();  
      setSuggestions([]);  
      setIsSearchDisabled(true);  
      return;
    }
    setIsSearchDisabled(false); //enable the search button once there is input

    //filter the employees based on the input value
    if (value.length >= 2) {
      const filteredSuggestions = employees.filter((employee) =>
        employee.name.toLowerCase().includes(value.toLowerCase()) ||
        employee.workTitle.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setFilteredEmployees(filteredSuggestions); //update filtered list in the parent
    } else {
      setSuggestions(employees); //show all employees if less than 2 letters typed
      setFilteredEmployees([]);  
    }
  };

  //handle key down events for arrow keys and enter
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      setHighlightedIndex((prevIndex) => {
        const newIndex = prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0;
        scrollToSuggestion(newIndex);  
        return newIndex;
      });
    } else if (event.key === 'ArrowUp') {
      setHighlightedIndex((prevIndex) => {
        const newIndex = prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1;
        scrollToSuggestion(newIndex);  
        return newIndex;
      });
    } else if (event.key === 'Enter' && highlightedIndex >= 0) {
      selectEmployee(suggestions[highlightedIndex]);
    }
  };

  //function to scroll to the highlighted suggestion
  const scrollToSuggestion = (index) => {
    if (suggestionRefs.current[index]) {
      suggestionRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  //function to bold matching letters in the text
  const highlightMatch = (text) => {
    if (!inputValue || inputValue.length < 2) return text;
    const regex = new RegExp(`(${inputValue})`, 'gi'); //regex with the input value and global, case-insensitive flags
    const parts = text.split(regex); //split the text based on the regex 
    return parts.map((part, index) =>
      regex.test(part) ? <strong key={index}>{part}</strong> : part
    );
  };
  
  return (
    <div ref={autocompleteRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}  
        placeholder="Search employee..."
        className="autocomplete-input"
      />
      
      {/* Show suggestions only if search is not performed */}
      {!searchPerformed && suggestions.length > 0 && (
      <ul className="autocomplete-suggestions">
        {suggestions.map((employee, index) => (
          <li
            key={employee.name}
            ref={(el) => (suggestionRefs.current[index] = el)}  // ref for each suggestion
            className={`suggestion-item ${index === highlightedIndex ? 'highlighted' : ''}`}  // classes for styling
            onMouseDown={() => selectEmployee(employee)}
            onMouseEnter={() => setHighlightedIndex(index)}
          >
            <img src={employee.imageUrl} alt={employee.name} className="employee-img" />
            {highlightMatch(employee.name)} - {highlightMatch(employee.workTitle)}
          </li>
        ))}
      </ul>
      )}
    </div>
  );
};

export default Autocomplete;
