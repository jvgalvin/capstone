const { Client } = require('pg');

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
    const data = {"ad_probability": -1,"Diagnosis_at_Baseline":"LMCI","Age":67.5,"Gender":"Male","Years_of_Education":10,"Ethnicity":"Hisp/Latino","Race":"White","APOE4":0.0,"MMSE":27.0,"FreeSurfer.convexity..median.1024":-0.3041386604,"FreeSurfer.convexity..75..1005":-0.0419929773,"FreeSurfer.convexity..25..2017":-0.8225753903,"geodesic.depth..median.1017":0.0739987,"FreeSurfer.convexity..75..1013":0.0415118048,"FreeSurfer.convexity..mean.1005":-0.3293391367,"FreeSurfer.convexity..SD.2016":0.3947719923,"mean.curvature..skew.2007":-0.7409500265,"travel.depth..kurtosis.2016":-0.9291294844,"geodesic.depth..kurtosis.2016":-0.8025531133,"FreeSurfer.convexity..skew.1005":-0.2868374242,"geodesic.depth..MAD.1017":0.07025852,"geodesic.depth..kurtosis.2003":-1.0512882688,"geodesic.depth..median.1024":0.130673,"FreeSurfer.thickness..kurtosis.2031":-0.4094972527,"geodesic.depth..25..1024":0.0283946,"FreeSurfer.convexity..median.1005":-0.4463556409,"FreeSurfer.convexity..mean.1024":-0.1882189398,"FreeSurfer.convexity..kurtosis.1035":-1.0478155295,"travel.depth..median.1017":2.50808,"FreeSurfer.convexity..MAD.1034":0.3352779895,"FreeSurfer.convexity..mean.1013":-0.2379040985,"FreeSurfer.convexity..mean.2017":-0.3073992311,"mean.curvature..kurtosis.1012":-0.3161156595,"travel.depth..25..2014":0.18153,"FreeSurfer.thickness..MAD.1030":0.4815375805,"FreeSurfer.convexity..SD.2007":0.455420991,"geodesic.depth..skew.1005":0.244972332,"FreeSurfer.convexity..mean.1017":-0.2939803651,"travel.depth..MAD.1017":2.387827,"geodesic.depth..75..1013":0.143296,"FreeSurfer.convexity..median.2017":-0.4740116894,"mean.curvature..kurtosis.2017":-0.521346065,"travel.depth..skew.1005":0.3099299457,"geodesic.depth..mean.1024":0.1632739171,"geodesic.depth..mean.1017":0.1118046319,"FreeSurfer.thickness..SD.1030":0.7515073666,"FreeSurfer.thickness..kurtosis.2011":-0.1043461037,"FreeSurfer.convexity..kurtosis.2003":-0.9081563766,"geodesic.depth..75..1035":0.857783,"FreeSurfer.convexity..median.1017":-0.3944549263,"FreeSurfer.convexity..75..1017":0.0557703637,"FreeSurfer.convexity..median.1013":-0.3122470379,"FreeSurfer.convexity..kurtosis.2016":-0.6604310251,"geodesic.depth..75..1024":0.259387,"travel.depth..25..1017":0.382777,"FreeSurfer.thickness..skew.1007":0.8298158569,"travel.depth..kurtosis.2003":-1.0165734317,"FreeSurfer.convexity..kurtosis.2030":-1.0448463437,"FreeSurfer.convexity..kurtosis.1005":-1.0601843929,"geodesic.depth..median.1013":0.0703935,"geodesic.depth..75..1034":0.713412, }
    const data_part_two = { "geodesic.depth..kurtosis.2009":-1.182161277,"geodesic.depth..75..1017":0.18889,"FreeSurfer.thickness..median.1017":1.7823790312,"travel.depth..25..1024":0.839302,"geodesic.depth..kurtosis.1009":-1.1346834489,"FreeSurfer.thickness..kurtosis.2017":0.3652512457,"mean.curvature..kurtosis.2012":-0.160233786,"FreeSurfer.convexity..SD.1034":0.4434771189,"FreeSurfer.convexity..MAD.2016":0.2350733727,"mean.curvature..skew.2029":-0.607839259,"geodesic.depth..mean.1013":0.0943134866,"FreeSurfer.thickness..MAD.2021":0.1749446392,"FreeSurfer.convexity..75..2034":0.7047955394,"FreeSurfer.convexity..SD.2003":0.6360757545,"mean.curvature..kurtosis.2007":-0.5114699725,"FreeSurfer.thickness..kurtosis.2021":0.147405259,"geodesic.depth..SD.2012":0.1262609047,"FreeSurfer.convexity..median.2012":-0.0724348575,"FreeSurfer.thickness..kurtosis.2025":-0.1472087948,"geodesic.depth..25..2014":0.00352458,"geodesic.depth..median.1034":0.584828,"FreeSurfer.thickness..MAD.2031":0.3680799007,"travel.depth..skew.2002":0.358924359,"geodesic.depth..kurtosis.1018":-1.0160986685,"FreeSurfer.convexity..25..1005":-0.6565053463,"FreeSurfer.convexity..25..1024":-0.663970992,"travel.depth..kurtosis.2002":-0.0268656742,"FreeSurfer.convexity..75..2022":0.1616883576,"FreeSurfer.convexity..25..2012":-0.3725186884,"travel.depth..kurtosis.1005":-0.9440314871,"mean.curvature..SD.2009":2.8947270611,"FreeSurfer.convexity..75..1024":0.2195511907,"FreeSurfer.convexity..SD.2017":0.6740049304,"travel.depth..MAD.1022":4.342545,"FreeSurfer.convexity..MAD.2003":0.4325919598,"travel.depth..SD.2016":3.3096376094,"mean.curvature..25..1024":-4.90336,"geodesic.depth..25..1017":0.0228513,"geodesic.depth..25..2030":0.0561638,"FreeSurfer.convexity..MAD.1035":0.3746078629,"geodesic.depth..SD.2034":0.118692501,"FreeSurfer.thickness..75..1017":2.0929532051,"mean.curvature..kurtosis.1024":-0.5876524549,"FreeSurfer.thickness..25..2013":1.4965190887,"mean.curvature..kurtosis.2011":-0.5208675406,"FreeSurfer.convexity..mean.2012":-0.0691443482,"travel.depth..kurtosis.2034":-0.8980741063,"FreeSurfer.thickness..median.2017":1.8157212734,"mean.curvature..median.1005":-3.0374,"FreeSurfer.thickness..25..2025":1.7547264099,"geodesic.depth..kurtosis.1005":-0.9931310138,"FreeSurfer.convexity..75..2016":0.0944628343,"FreeSurfer.thickness..median.2013":1.8782224655,"geodesic.depth..MAD.1013":0.0536722,"FreeSurfer.thickness..mean.1017":1.8336383661,"FreeSurfer.thickness..skew.1017":0.600432719 }
    const data_part_three = { "geodesic.depth..25..1005":0.0231425,"FreeSurfer.thickness..MAD.2016":0.6036396027,"travel.depth..25..2022":0.614581,"geodesic.depth..SD.2016":0.0760734152,"FreeSurfer.thickness..SD.2016":0.8008621442,"geodesic.depth..mean.2012":0.1578962955,"geodesic.depth..median.2030":0.167719,"FreeSurfer.convexity..skew.2014":-0.4254214236,"FreeSurfer.convexity..SD.2031":0.6303603764,"geodesic.depth..MAD.1030":0.11987,"travel.depth..kurtosis.1034":-0.8440365362,"travel.depth..25..1005":0.516824,"travel.depth..skew.2030":-0.1790890009,"FreeSurfer.thickness..25..2017":1.5213327408,"FreeSurfer.convexity..MAD.2017":0.3930668533,"geodesic.depth..25..1013":0.0246371,"geodesic.depth..mean.1034":0.5689924216,"geodesic.depth..skew.2029":0.1788553668,"travel.depth..25..2030":2.03181,"mean.curvature..mean.1005":-2.884279856,"FreeSurfer.convexity..MAD.2022":0.4344983399,"FreeSurfer.convexity..kurtosis.2031":-0.6973119537,"mean.curvature..skew.2014":-0.8078628207,"geodesic.depth..75..1030":0.294473,"FreeSurfer.convexity..skew.1012":-0.5357308943,"mean.curvature..75..2025":-0.457938,"FreeSurfer.thickness..kurtosis.1017":0.0504272664,"travel.depth..25..2031":1.21267,"geodesic.depth..kurtosis.1034":-0.850155529,"geodesic.depth..kurtosis.2002":-0.8246946132,"mean.curvature..75..1013":-1.37892,"FreeSurfer.thickness..25..1017":1.5172727108,"geodesic.depth..mean.1030":0.188601711,"travel.depth..SD.2034":5.3649734516,"geodesic.depth..skew.2030":-0.1685252461,"FreeSurfer.thickness..kurtosis.2029":0.1881543029,"travel.depth..SD.2012":5.2739536048,"geodesic.depth..median.2014":0.0377215,"FreeSurfer.thickness..75..2013":2.3669848442,"travel.depth..75..1013":5.4461825,"FreeSurfer.convexity..kurtosis.2017":-1.2241311804,"geodesic.depth..SD.1030":0.1821043959 }
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
        patient_id VARCHAR NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
        );
    `;
    res = await client.query(createTableQuery);
    console.log(`Created table. ${res}`);

    for (const patient of patient_data) {
        console.log(patient)
        console.log(`adding: ${patient["patient_id"]}`)
        let insertRow = await client.query('INSERT INTO patients(patient_id) VALUES($1);',
                                           [`${patient["patient_id"]}`]);
        console.log(`Inserted ${insertRow.rowCount} row`);
    }

    let createRecordTableQuery = `
        CREATE TABLE IF NOT EXISTS records(
        id INT GENERATED ALWAYS AS IDENTITY,
        patient_id VARCHAR,
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

    for (const patient of patient_data) {
        console.log(patient)
        console.log(`adding data for : ${patient["patient_id"]}`)
        let variables = "INSERT INTO records(patient_id, "
        for (const d of Object.keys(data)) {
            variables = variables + `${d.replaceAll(".", "")},`
        }
        for (const d of Object.keys(data_part_two)) {
            variables = variables + `${d.replaceAll(".", "")},`
        }
        for (const d of Object.keys(data_part_three)) {
            variables = variables + `${d.replaceAll(".", "")},`
        }
        variables = variables.substring(0, variables.length - 1) + ") VALUES($1, "
        let count = 1 
        while(count < Object.keys(data).length + 1) {
            count++
            variables = variables + `$${count}, `
        }
        while(count < Object.keys(data_part_two).length + Object.keys(data).length + 1) {
            count++
            variables = variables + `$${count}, `
        }
        while(count < Object.keys(data_part_three).length + Object.keys(data_part_two).length + Object.keys(data).length + 1) {
            count++
            variables = variables + `$${count}, `
        }
        variables = variables.substring(0, variables.length - 2) + ");"
        console.log(variables)
        values = [`${patient["patient_id"]}`,`${patient["ad_probability"]}`, "LMCI",`${patient["Age"]}`,`${patient["Gender"]}`,
                  `${patient["Years_of_Education"]}`, `${patient["Ethnicity"]}`, `${patient["Race"]}`, `${patient["APOE4"]}`,`${patient["MMSE"]}`]
        columns_to_not_use = ["patient_id", "Diagnosis_at_Baseline", "APOE4", "MMSE", "Age", "Gender", "Years_of_Education", "Ethnicity", "Race", "ad_probability"]
        for (const d of Object.keys(data)) {
            if (!columns_to_not_use.includes(d.replaceAll(".", ""))) {
                values.push(data[d])
            }
        }
        for (const d of Object.keys(data_part_two)) {
            if (!columns_to_not_use.includes(d.replaceAll(".", ""))) {
                values.push(data_part_two[d])
            }
        }
        for (const d of Object.keys(data_part_three)) {
            if (!columns_to_not_use.includes(d.replaceAll(".", ""))) {
                values.push(data_part_three[d])
            }
        }
        let insertRow = await client.query(variables, values);
        console.log(`Inserted ${insertRow.rowCount} row`);
    }
    
    await client.end();
})();