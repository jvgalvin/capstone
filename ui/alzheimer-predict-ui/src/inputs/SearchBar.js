import { useState } from 'react';
import { getPatientByNameID } from '../DatabaseConnection.js';

function SearchBar({handleFoundPatient, handlePatientNameEntered}) {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const fetchData = async (value) => {
        if (value.length >= 2) {
            try {
                let patient = await getPatientByNameID(value);
                setSuggestions([patient])
            } catch (error) {
            console.log(error);
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
                placeholder="Enter Name / Search by Name or Patient ID"
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
                    {suggestion["patient_name"]}
                </div>
            ))}
        </div>
    )
}

export default SearchBar;