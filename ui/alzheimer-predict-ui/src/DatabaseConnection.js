const { Client } = require('pg');

async function connectToDB() {
    const client = new Client({
        host: 'localhost',
        database: 'alzheimer_predict',
        user: 'alzheimer_predict_user',
        password: '12345678',
        port: '5432',
        ssl: false
    });
    await client.connect();
    return client
}

async function getPatientByName(patient_name) {
    const client = connectToDB();
    let res = await client.query('SELECT * FROM patients WHERE patient_name=$1', `${patient_name}`);
    console.log(res.rows[0].connected);
    await client.end();
}