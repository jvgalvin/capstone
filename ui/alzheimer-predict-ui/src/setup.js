const { Client } = require('pg');

const data = [
    {
        "patient_name": "Patient One",
        "alleles": 2,
        "mmse": 24,
        "age": 68,
        "gender": "F",
        "education": 16,
        "race": "W"
    },
    {
        "patient_name": "Patient Two",
        "alleles": 1,
        "mmse": 15,
        "age": 55,
        "gender": "F",
        "education": 14,
        "race": "S"
    },
    {
        "patient_name": "Patient Three",
        "alleles": 2,
        "mmse": 20,
        "age": 70,
        "gender": "M",
        "education": 12,
        "race": "W"
    },
    {
        "patient_name": "Patient Four",
        "alleles": 1,
        "mmse": 24,
        "age": 75,
        "gender": "M",
        "education": 16,
        "race": "B"
    },
    {
        "patient_name": "Patient Five",
        "alleles": 3,
        "mmse": 30,
        "age": 60,
        "gender": "F",
        "education": 16,
        "race": "S"
    },
];

(async () => {
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

    let createTableQuery = `
        CREATE TABLE IF NOT EXISTS patients(
        id INT GENERATED ALWAYS AS IDENTITY,
        patient_name VARCHAR NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
        );
    `;
    res = await client.query(createTableQuery);
    console.log(`Created table. ${res}`);

    for (const patient of data) {
        console.log(patient)
        console.log(`adding: ${patient["patient_name"]}`)
        let insertRow = await client.query('INSERT INTO patients(patient_name) VALUES($1);',
                                           [`${patient["patient_name"]}`]);
        console.log(`Inserted ${insertRow.rowCount} row`);
    }

    let createRecordTableQuery = `
        CREATE TABLE IF NOT EXISTS records(
        id INT GENERATED ALWAYS AS IDENTITY,
        patient_id INT,
        alleles INT,
        mmse INT,
        age INT,
        gender VARCHAR(5),
        education INT,
        race VARCHAR(10),
        ad_probability INT,
        created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
        updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp 
        );
    `;
    res = await client.query(createRecordTableQuery);
    console.log(`Created table. ${res}`);

    for (const patient of data) {
        console.log(patient)
        console.log(`adding: ${patient["patient_name"]}`)
        let patient_id = await client.query(`SELECT id FROM patients WHERE patient_name='${patient["patient_name"]}'`)
        console.log(patient_id.rows[0]["id"]);
        let insertRow = await client.query('INSERT INTO records(patient_id, alleles, mmse, age, gender, education, race) VALUES($1, $2, $3, $4, $5, $6, $7);',
                                           [`${patient_id.rows[0]["id"]}`,`${patient["alleles"]}`,`${patient["mmse"]}`,`${patient["age"]}`,`${patient["gender"]}`,
                                           `${patient["education"]}`,`${patient["race"]}`]);
        console.log(`Inserted ${insertRow.rowCount} row`);
    }
    
    await client.end();
})();