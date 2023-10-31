export function getPatientByNameID(value) {
    return fetch(`http://127.0.0.1:8000/patient?name=${value}`)
        .then((response) => response.json())
        .then((patient) => {
            return patient
        })
        .catch((err) => {
            console.log(err.message);
        })
}

export function getPatientHistory(id) {
    return fetch(`http://127.0.0.1:8000/patient/record?patient_id=${id}`)
        .then((response) => response.json())
        .then((history) => {
            return history
        })
        .catch((err) => {
            console.log(err.message);
        })
}