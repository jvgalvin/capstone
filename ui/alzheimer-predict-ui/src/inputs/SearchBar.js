import { useState } from 'react';
import { getPatientByNameID } from '../DatabaseConnection.js';

function SearchBar({handleFoundPatient, handlePatientNameEntered}) {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const fetchData = async (value) => {
        console.log(value)
        if (value.length > 2) {
            try {
                let patient = await getPatientByNameID(value);
                if(patient !== null) {
                    setSuggestions([patient])
                } else {
                    throw new Error("Unable to retrieve patient data.")
                }
            } catch (error) {
                console.log(error);
                setSuggestions([]);
                handleFoundPatient(null);
            }
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div>
            <input
                className="searchbar-input"
                type="text"
                placeholder="Enter Patient ID"
                value={value}
                onChange={(e) => {
                    handlePatientNameEntered(e);
                    setValue(e.target.value);
                    fetchData(e.target.value);
                }}
            />
            {suggestions.map((suggestion) => (
                <div className="suggestion-container" onClick={() => {
                        handleFoundPatient({suggestion})
                        setSuggestions([])
                    }
                }>
                    {suggestion["patient_id"]}
                </div>
            ))}
        </div>
    )
}

export default SearchBar;