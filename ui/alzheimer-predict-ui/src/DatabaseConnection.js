const host = "http://127.0.0.1:8000/"

export function getPatientByNameID(value) {
    return fetch(`${host}patient?id=${value}`)
        .then((response) => {
            if(!response.ok) {
                throw new Error(response.status + ": " + response.statusText)
            }
            console.log(response)
            return response.json()
        })
        .then((patient) => {
            return patient
        })
        .catch((err) => {
            console.log(err.message);
            return null;
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

export function addHistoryForPatient(inputs) {
    let options = {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
        },
        body: JSON.stringify({
            "patient_id": inputs.patient_id,
            "Diagnosis_at_Baseline": inputs.Diagnosis_at_Baseline,
            "APOE4": inputs.APOE4,
            "MMSE": inputs.MMSE,
            "Age": inputs.Age,
            "Gender": inputs.Gender,
            "Years_of_Education": inputs.Years_of_Education,
            "Ethnicity": inputs.Ethnicity,
            "Race": inputs.Race,
            "ad_probability": inputs.ad_probability
        })
    }
    return fetch(`${host}patient/record`, options)
        .then((response) => {
            if(!response.ok) {
                throw new Error(response.status + ": " + response.statusText)
            }
            return response.json()
        })
        .then((success) => {
            return success
        })
        .catch((err) => {
            console.log(err.message);
        })
}