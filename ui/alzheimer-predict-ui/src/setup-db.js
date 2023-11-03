const { Client } = require('pg');
var fs = require('fs');
var arrayPath = "./ui/alzheimer-predict-ui/src/db_data_converted.json"

function fsReadFileSynchToArray (filePath) {
    var data = JSON.parse(fs.readFileSync(filePath));
    return data;
}

var db_data  = fsReadFileSynchToArray(arrayPath);

const patient_data = [
    {
        "patient_id": "ABC",
        "Diagnosis_at_Baseline": "LMCI",
        "APOE4": 2,
        "MMSE": 24,
        "Age": 68,
        "Gender": "Female",
        "Years_of_Education": 16,
        "Ethnicity": "Hisp/Latino",
        "Race": "White",
        "ad_probability": -1
    },
    {
        "patient_id": "CDB",
        "Diagnosis_at_Baseline": "LMCI",
        "APOE4": 1,
        "MMSE": 15,
        "Age": 55,
        "Gender": "Female",
        "Years_of_Education": 14,
        "Ethnicity": "Hisp/Latino",
        "Race": "White",
        "ad_probability": 71
    },
    {
        "patient_id": "FJK",
        "Diagnosis_at_Baseline": "LMCI",
        "APOE4": 2,
        "MMSE": 20,
        "Age": 70,
        "Gender": "Male",
        "Years_of_Education": 12,
        "Ethnicity": "Hisp/Latino",
        "Race": "White",
        "ad_probability": 80
    },
    {
        "patient_id": "XYZ",
        "Diagnosis_at_Baseline": "LMCI",
        "APOE4": 1,
        "MMSE": 24,
        "Age": 75,
        "Gender": "Male",
        "Years_of_Education": 16,
        "Ethnicity": "Hisp/Latino",
        "Race": "Black",
        "ad_probability": -1
    },
    {
        "patient_id": "PWK",
        "Diagnosis_at_Baseline": "LMCI",
        "APOE4": 3,
        "MMSE": 30,
        "Age": 60.5,
        "Gender": "Female",
        "Years_of_Education": 16,
        "Ethnicity": "Hisp/Latino",
        "Race": "White",
        "ad_probability": 75
    },
];

function isFloat(inputString) {
    console.log(inputString)
    const parsed = parseFloat(inputString);
    console.log(parsed)
    console.log(!isNaN(parsed))
    console.log(parsed.toString())
    console.log(parsed.toString() == inputString)
    return !isNaN(parsed) && parsed.toString() == inputString;
}

function isInt(inputString) {
    const parsed = parseInt(inputString);

    return !isNaN(parsed) && parsed.toString() == inputString;
}

(async () => {

    const data = db_data[0][0]
    const data_part_two = db_data[0][1]
    const data_part_three = db_data[0][2]
    const client = new Client({
        host: 'localhost',
        database: 'alzheimer_predict',
        user: 'alzheimer_predict_user',
        password: '12345678',
        port: '5432',
        ssl: false
    });
    await client.connect();
    let res = await client.query('SELECT $1::text as connected', ['Connection to postgres successful!']);
    console.log(res.rows[0].connected);

    /*
        CREATE PATIENTS TABLE
    */

    let createTableQuery = `
        CREATE TABLE IF NOT EXISTS patients(
        id INT GENERATED ALWAYS AS IDENTITY,
        patient_id VARCHAR NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
        );
    `;
    res = await client.query(createTableQuery);
    console.log(`Created table. ${res}`);

    /*
        CREATE RECORDS TABLE
    */

    let createRecordTableQuery = `
        CREATE TABLE IF NOT EXISTS records(
        id INT GENERATED ALWAYS AS IDENTITY,
    `;

    for (const d of Object.keys(data)) {
        if (isInt(data[d])) {
            createRecordTableQuery = createRecordTableQuery + `${d.replaceAll(".", "")} INT,`
        } else if (isFloat(data[d])) {
            createRecordTableQuery = createRecordTableQuery + `${d.replaceAll(".", "")} FLOAT,`
        } else {
            createRecordTableQuery = createRecordTableQuery + `${d.replaceAll(".", "")} VARCHAR(20),`
        }
    }

    for (const d of Object.keys(data_part_two)) {
        if (isInt(data_part_two[d])) {
            createRecordTableQuery = createRecordTableQuery + `${d.replaceAll(".", "")} INT,`
        } else if (isFloat(data_part_two[d])) {
            createRecordTableQuery = createRecordTableQuery + `${d.replaceAll(".", "")} FLOAT,`
        } else {
            createRecordTableQuery = createRecordTableQuery + `${d.replaceAll(".", "")} VARCHAR(20),`
        }
    }

    for (const d of Object.keys(data_part_three)) {
        if (isInt(data_part_three[d])) {
            createRecordTableQuery = createRecordTableQuery + `${d.replaceAll(".", "")} INT,`
        } else if (isFloat(data_part_three[d])) {
            createRecordTableQuery = createRecordTableQuery + `${d.replaceAll(".", "")} FLOAT,`
        } else {
            createRecordTableQuery = createRecordTableQuery + `${d.replaceAll(".", "")} VARCHAR(20),`
        }
    }

    createRecordTableQuery = createRecordTableQuery + `
        created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
        updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp 
        );
    `;

    console.log(createRecordTableQuery);

    res = await client.query(createRecordTableQuery);
    console.log(`Created table. ${res}`);

    /*
        POPULATE TABLES FROM DATA
    */

    for (const row of db_data) {
        const data_1 = row[0]
        const data_2 = row[1]
        const data_3 = row[2]
        
        /*
            POPULATE PATIENTS TABLE
        */

        console.log(`adding: ${data_1["patient_id"]}`)
        let insertPatientRow = await client.query('INSERT INTO patients(patient_id) VALUES($1);',
                                               [`${data_1["patient_id"]}`]);
        console.log(`Inserted ${insertPatientRow.rowCount} row`);

        /*
            POPULATE RECORDS TABLE
        */

        console.log(`adding data for : ${data_1["patient_id"]}`)
        let variables = "INSERT INTO records("
        for (const d of Object.keys(data_1)) {
            variables = variables + `${d.replaceAll(".", "")},`
        }
        for (const d of Object.keys(data_2)) {
            variables = variables + `${d.replaceAll(".", "")},`
        }
        for (const d of Object.keys(data_3)) {
            variables = variables + `${d.replaceAll(".", "")},`
        }
        variables = variables.substring(0, variables.length - 1) + ") VALUES("
        let count = 0 
        while(count < Object.keys(data_1).length) {
            count++
            variables = variables + `$${count}, `
        }
        while(count < Object.keys(data_2).length + Object.keys(data_1).length) {
            count++
            variables = variables + `$${count}, `
        }
        while(count < Object.keys(data_3).length + Object.keys(data_2).length + Object.keys(data_1).length) {
            count++
            variables = variables + `$${count}, `
        }
        variables = variables.substring(0, variables.length - 2) + ");"
        console.log(variables)
        values = []
        for (const d of Object.keys(data_1)) {
            values.push(data_1[d])
        }
        for (const d of Object.keys(data_2)) {
            values.push(data_2[d])
        }
        for (const d of Object.keys(data_3)) {
            values.push(data_3[d])
        }
        let insertRow = await client.query(variables, values);
        console.log(`Inserted ${insertRow.rowCount} row`);
    }
    
    await client.end();
})();