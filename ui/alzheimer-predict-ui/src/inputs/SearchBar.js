import { useState } from 'react';

function SearchBar({handleFoundPatient}) {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const getPatientByNameID = (value) => {
        fetch(`http://127.0.0.1:8000/patient?name=${value}`)
            .then((response) => response.json())
            .then((patient) => {
                console.log(patient);
                setSuggestions([patient]);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const fetchData = async (value) => {
        console.log(value.length)
        if (value.length >= 2) {
            try {
                await getPatientByNameID(value);
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
                placeholder="Search by Name or Patient ID"
                value={value}
                onChange={(e) => {
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