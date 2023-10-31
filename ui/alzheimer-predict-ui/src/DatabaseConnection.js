const host = "http://127.0.0.1:8000/"

export function getPatientByNameID(value) {
    return fetch(`${host}patient?name=${value}`)
        .then((response) => response.json())
        .then((patient) => {
            return patient
        })
        .catch((err) => {
            console.log(err.message);
        })
}

export function getPatientHistory(id) {
    return fetch(`${host}patient/record?patient_id=${id}`)
        .then((response) => response.json())
        .then((history) => {
            return history
        })
        .catch((err) => {
            console.log(err.message);
        })
}

export function addPatient(name) {
    return fetch(`${host}patient?patient=${name}`, {method: "POST"})
        .then((response) => response.json())
        .then((patient) => {
            return patient
        })
        .catch((err) => {
            console.log(err.message);
        })
}

export function addHistoryForPatient(patient_id, inputs) {
    let options = {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
        },
        body: {
            "patient_id": patient_id,
            "Diagnosis_at_Baseline": "" 
            // "APOE4: int
            // "MMSE: int
            // "Age: float
            // "Gender: str
            // "Years_of_Education: int
            // "Ethnicity: str
            // "Race: str
            // "ad_probability: int
        }      
    }
    return fetch(`${host}patient/record`, options)
        .then((response) => response.json())
        .then((patient) => {
            return patient
        })
        .catch((err) => {
            console.log(err.message);
        })
}