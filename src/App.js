import React, { useState } from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableOptions, setAvailableOptions] = useState([
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
  ]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleSchemaChange = (event, index) => {
    const newValue = event.target.value;
    const updatedSchemas = [...selectedSchemas];
    const oldValue = updatedSchemas[index].value;

    updatedSchemas[index] = {
      value: newValue,
      label: availableOptions.find(option => option.value === newValue).label,
    };
    
    setSelectedSchemas(updatedSchemas);

    setAvailableOptions(prevOptions => 
      prevOptions.filter(option => option.value !== newValue).concat(
        availableOptions.find(option => option.value === oldValue)
      )
    );
  };

  const handleAddNewSchema = () => {
    const schemaDropdown = document.getElementById('schema-dropdown');
    const selectedOption = schemaDropdown.value;

    if (selectedOption) {
      const selectedLabel = availableOptions.find(option => option.value === selectedOption).label;

      setSelectedSchemas([...selectedSchemas, { label: selectedLabel, value: selectedOption }]);
      
      setAvailableOptions(prevOptions =>
        prevOptions.filter(option => option.value !== selectedOption)
      );

      schemaDropdown.value = "";
    }
  };

  const handleSaveSegment = async () => {
    const segmentData = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({ [schema.value]: schema.label })),
    };
  
    try {
      const response = await fetch('/ac4af956-0f29-47fb-9313-6ec039c1ec7f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(segmentData),
      });
  
      if (response.ok) {
        console.log('Data sent successfully:', segmentData);
        alert('Segment saved successfully!');
        setShowPopup(false);
        setSegmentName('');
        setSelectedSchemas([]);
        setAvailableOptions([
          { label: 'First Name', value: 'first_name' },
          { label: 'Last Name', value: 'last_name' },
          { label: 'Gender', value: 'gender' },
          { label: 'Age', value: 'age' },
          { label: 'Account Name', value: 'account_name' },
          { label: 'City', value: 'city' },
          { label: 'State', value: 'state' },
        ]);
      } else {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        alert(`Failed to save segment: ${errorText}`);
      }
    } catch (error) {
      console.error('Error sending data:', error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <button className="save-segment-btn" onClick={togglePopup}>Save Segment</button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-inner">
              <div className="header">
                <h3 className="header-title left-aligned">
                  <i className="fas fa-angle-left"></i>
                  Saving Segment
                </h3>
              </div>
              <h4 className="left-aligned">Enter the Name of the Segment</h4>
              <input
                type="text"
                placeholder="Enter segment name"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
              />
              <h5 style={{ textAlign: 'left', fontSize: '14px' }}>
                To save your segment, you need to add the schemas to build the query
              </h5>

              <div className="blue-box">
                {selectedSchemas.map((schema, index) => (
                  <div key={index} className="schema-row">
                    <select value={schema.value} onChange={(e) => handleSchemaChange(e, index)}>
                      <option value={schema.value}>{schema.label}</option>
                    </select>
                  </div>
                ))}
              </div>
              
              <div className="schema-dropdown">
                <h4 className="left-aligned">Add schema to segment:</h4>
                <select id="schema-dropdown" defaultValue="">
                  <option value="" disabled>Select schema</option>
                  {availableOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-schema-container">
                <span className="add-schema-link" onClick={handleAddNewSchema}>+ Add new schema</span>
              </div>

              <div className="button-container">
                <button className="save-segment-btn" onClick={handleSaveSegment}>Save the Segment</button>
                <button className="close-btn" onClick={togglePopup}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
