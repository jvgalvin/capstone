from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

import json
import joblib
import numpy as np
import pandas as pd
import psycopg2

OBJECT_PATH = "/workspaces/capstone/project/src/"

# TODO: DELETE THIS WHEN THE DB IS WORKING!!!
json_string = """
{"Diagnosis_at_Baseline":"LMCI","Age":67.5,"Gender":"Male","Years_of_Education":10,"Ethnicity":"Hisp/Latino","Race":"White","APOE4":0.0,"MMSE":27.0,"FreeSurfer.convexity..median.1024":-0.3041386604,"FreeSurfer.convexity..75..1005":-0.0419929773,"FreeSurfer.convexity..25..2017":-0.8225753903,"geodesic.depth..median.1017":0.0739987,"FreeSurfer.convexity..75..1013":0.0415118048,"FreeSurfer.convexity..mean.1005":-0.3293391367,"FreeSurfer.convexity..SD.2016":0.3947719923,"mean.curvature..skew.2007":-0.7409500265,"travel.depth..kurtosis.2016":-0.9291294844,"geodesic.depth..kurtosis.2016":-0.8025531133,"FreeSurfer.convexity..skew.1005":-0.2868374242,"geodesic.depth..MAD.1017":0.07025852,"geodesic.depth..kurtosis.2003":-1.0512882688,"geodesic.depth..median.1024":0.130673,"FreeSurfer.thickness..kurtosis.2031":-0.4094972527,"geodesic.depth..25..1024":0.0283946,"FreeSurfer.convexity..median.1005":-0.4463556409,"FreeSurfer.convexity..mean.1024":-0.1882189398,"FreeSurfer.convexity..kurtosis.1035":-1.0478155295,"travel.depth..median.1017":2.50808,"FreeSurfer.convexity..MAD.1034":0.3352779895,"FreeSurfer.convexity..mean.1013":-0.2379040985,"FreeSurfer.convexity..mean.2017":-0.3073992311,"mean.curvature..kurtosis.1012":-0.3161156595,"travel.depth..25..2014":0.18153,"FreeSurfer.thickness..MAD.1030":0.4815375805,"FreeSurfer.convexity..SD.2007":0.455420991,"geodesic.depth..skew.1005":0.244972332,"FreeSurfer.convexity..mean.1017":-0.2939803651,"travel.depth..MAD.1017":2.387827,"geodesic.depth..75..1013":0.143296,"FreeSurfer.convexity..median.2017":-0.4740116894,"mean.curvature..kurtosis.2017":-0.521346065,"travel.depth..skew.1005":0.3099299457,"geodesic.depth..mean.1024":0.1632739171,"geodesic.depth..mean.1017":0.1118046319,"FreeSurfer.thickness..SD.1030":0.7515073666,"FreeSurfer.thickness..kurtosis.2011":-0.1043461037,"FreeSurfer.convexity..kurtosis.2003":-0.9081563766,"geodesic.depth..75..1035":0.857783,"FreeSurfer.convexity..median.1017":-0.3944549263,"FreeSurfer.convexity..75..1017":0.0557703637,"FreeSurfer.convexity..median.1013":-0.3122470379,"FreeSurfer.convexity..kurtosis.2016":-0.6604310251,"geodesic.depth..75..1024":0.259387,"travel.depth..25..1017":0.382777,"FreeSurfer.thickness..skew.1007":0.8298158569,"travel.depth..kurtosis.2003":-1.0165734317,"FreeSurfer.convexity..kurtosis.2030":-1.0448463437,"FreeSurfer.convexity..kurtosis.1005":-1.0601843929,"geodesic.depth..median.1013":0.0703935,"geodesic.depth..75..1034":0.713412,"geodesic.depth..kurtosis.2009":-1.182161277,"geodesic.depth..75..1017":0.18889,"FreeSurfer.thickness..median.1017":1.7823790312,"travel.depth..25..1024":0.839302,"geodesic.depth..kurtosis.1009":-1.1346834489,"FreeSurfer.thickness..kurtosis.2017":0.3652512457,"mean.curvature..kurtosis.2012":-0.160233786,"FreeSurfer.convexity..SD.1034":0.4434771189,"FreeSurfer.convexity..MAD.2016":0.2350733727,"mean.curvature..skew.2029":-0.607839259,"geodesic.depth..mean.1013":0.0943134866,"FreeSurfer.thickness..MAD.2021":0.1749446392,"FreeSurfer.convexity..75..2034":0.7047955394,"FreeSurfer.convexity..SD.2003":0.6360757545,"mean.curvature..kurtosis.2007":-0.5114699725,"FreeSurfer.thickness..kurtosis.2021":0.147405259,"geodesic.depth..SD.2012":0.1262609047,"FreeSurfer.convexity..median.2012":-0.0724348575,"FreeSurfer.thickness..kurtosis.2025":-0.1472087948,"geodesic.depth..25..2014":0.00352458,"geodesic.depth..median.1034":0.584828,"FreeSurfer.thickness..MAD.2031":0.3680799007,"travel.depth..skew.2002":0.358924359,"geodesic.depth..kurtosis.1018":-1.0160986685,"FreeSurfer.convexity..25..1005":-0.6565053463,"FreeSurfer.convexity..25..1024":-0.663970992,"travel.depth..kurtosis.2002":-0.0268656742,"FreeSurfer.convexity..75..2022":0.1616883576,"FreeSurfer.convexity..25..2012":-0.3725186884,"travel.depth..kurtosis.1005":-0.9440314871,"mean.curvature..SD.2009":2.8947270611,"FreeSurfer.convexity..75..1024":0.2195511907,"FreeSurfer.convexity..SD.2017":0.6740049304,"travel.depth..MAD.1022":4.342545,"FreeSurfer.convexity..MAD.2003":0.4325919598,"travel.depth..SD.2016":3.3096376094,"mean.curvature..25..1024":-4.90336,"geodesic.depth..25..1017":0.0228513,"geodesic.depth..25..2030":0.0561638,"FreeSurfer.convexity..MAD.1035":0.3746078629,"geodesic.depth..SD.2034":0.118692501,"FreeSurfer.thickness..75..1017":2.0929532051,"mean.curvature..kurtosis.1024":-0.5876524549,"FreeSurfer.thickness..25..2013":1.4965190887,"mean.curvature..kurtosis.2011":-0.5208675406,"FreeSurfer.convexity..mean.2012":-0.0691443482,"travel.depth..kurtosis.2034":-0.8980741063,"FreeSurfer.thickness..median.2017":1.8157212734,"mean.curvature..median.1005":-3.0374,"FreeSurfer.thickness..25..2025":1.7547264099,"geodesic.depth..kurtosis.1005":-0.9931310138,"FreeSurfer.convexity..75..2016":0.0944628343,"FreeSurfer.thickness..median.2013":1.8782224655,"geodesic.depth..MAD.1013":0.0536722,"FreeSurfer.thickness..mean.1017":1.8336383661,"FreeSurfer.thickness..skew.1017":0.600432719,"geodesic.depth..25..1005":0.0231425,"FreeSurfer.thickness..MAD.2016":0.6036396027,"travel.depth..25..2022":0.614581,"geodesic.depth..SD.2016":0.0760734152,"FreeSurfer.thickness..SD.2016":0.8008621442,"geodesic.depth..mean.2012":0.1578962955,"geodesic.depth..median.2030":0.167719,"FreeSurfer.convexity..skew.2014":-0.4254214236,"FreeSurfer.convexity..SD.2031":0.6303603764,"geodesic.depth..MAD.1030":0.11987,"travel.depth..kurtosis.1034":-0.8440365362,"travel.depth..25..1005":0.516824,"travel.depth..skew.2030":-0.1790890009,"FreeSurfer.thickness..25..2017":1.5213327408,"FreeSurfer.convexity..MAD.2017":0.3930668533,"geodesic.depth..25..1013":0.0246371,"geodesic.depth..mean.1034":0.5689924216,"geodesic.depth..skew.2029":0.1788553668,"travel.depth..25..2030":2.03181,"mean.curvature..mean.1005":-2.884279856,"FreeSurfer.convexity..MAD.2022":0.4344983399,"FreeSurfer.convexity..kurtosis.2031":-0.6973119537,"mean.curvature..skew.2014":-0.8078628207,"geodesic.depth..75..1030":0.294473,"FreeSurfer.convexity..skew.1012":-0.5357308943,"mean.curvature..75..2025":-0.457938,"FreeSurfer.thickness..kurtosis.1017":0.0504272664,"travel.depth..25..2031":1.21267,"geodesic.depth..kurtosis.1034":-0.850155529,"geodesic.depth..kurtosis.2002":-0.8246946132,"mean.curvature..75..1013":-1.37892,"FreeSurfer.thickness..25..1017":1.5172727108,"geodesic.depth..mean.1030":0.188601711,"travel.depth..SD.2034":5.3649734516,"geodesic.depth..skew.2030":-0.1685252461,"FreeSurfer.thickness..kurtosis.2029":0.1881543029,"travel.depth..SD.2012":5.2739536048,"geodesic.depth..median.2014":0.0377215,"FreeSurfer.thickness..75..2013":2.3669848442,"travel.depth..75..1013":5.4461825,"FreeSurfer.convexity..kurtosis.2017":-1.2241311804,"geodesic.depth..SD.1030":0.1821043959}
"""

# Indices for the encoded parameters
POS_DIAGNOSIS = 0
POS_GENDER = 2
POS_ETHNICITY = 4
POS_RACE = 5

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
connection = psycopg2.connect(database="alzheimer_predict", user="alzheimer_predict_user", password="12345678", host="localhost", port=5432)

# Import Model-related objects
# model = joblib.load(OBJECT_PATH + "model.pkl")
# scaler = joblib.load(OBJECT_PATH + "scaler.gz")
# encoder_dx = joblib.load(OBJECT_PATH + "encoder_dx.gz")
# encoder_eth = joblib.load(OBJECT_PATH + "encoder_eth.gz")
# encoder_gender = joblib.load(OBJECT_PATH + "encoder_gender.gz")
# encoder_race = joblib.load(OBJECT_PATH + "encoder_race.gz")

class Patient(BaseModel):
    id: int
    patient_id: Optional[str] = None
    created_at: str

class Record(BaseModel):
    id: int
    patient_id: str
    Diagnosis_at_Baseline: str
    APOE4: int
    MMSE: int
    Age: float
    Gender: str
    Years_of_Education: int
    Ethnicity: str
    Race: str
    ad_probability: int
    created_at: str
    updated_at: str

class Records(BaseModel):
    records = [Record]

class InputRecord(BaseModel):
    patient_id: str
    Diagnosis_at_Baseline: str
    APOE4: int
    MMSE: int
    Age: float
    Gender: str
    Years_of_Education: int
    Ethnicity: str
    Race: str
    ad_probability: int

# Helper Methods
def query_db(query_str, fetch_all=False):
    cursor = connection.cursor()
    cursor.execute(query_str)
    
    if fetch_all:
        record = cursor.fetchall()
    else:
        record = cursor.fetchone()
    
    return record


def json_to_numpy(json_string):
    """This method converts the JSON response of the DB to a numpy array for the model to ingest for prediction"""
    # Convert to dict
    json_obj = json.loads(json_string)
    
    # Transform "Diagnosis_at_Baseline", "Gender", "Ethnicity", and "Race" with label_encoder.gz (should be able to do joblib.load('label_encoder.gz')
    json_obj["Diagnosis_at_Baseline"] = encoder_dx.transform([json_obj["Diagnosis_at_Baseline"]])[0]
    json_obj["Gender"] = encoder_gender.transform([json_obj["Gender"]])[0]
    json_obj["Ethnicity"] = encoder_eth.transform([json_obj["Ethnicity"]])[0]
    json_obj["Race"] = encoder_race.transform([json_obj["Race"]])[0]
    
    # Scale the data in the json request (can use joblib.load('scaler.gz'). Note that you may have to reshape since it's a single sample
    feature_array = np.array(list(json_obj.values())).reshape(1,-1)
    features_scaled = scaler.transform(feature_array)
    
    # Return array
    return features_scaled

def db_tuple_to_numpy(input_tuple):
    """This method converts the Tuple `record` of the DB to a numpy array for the model to ingest for prediction"""
    
    # Convert Tuple to mutable list
    value_list = list(input_tuple)
    
    # Remove values not part of prediction input
    value_list = value_list[3:161]
    
    # Transform "Diagnosis_at_Baseline", "Gender", "Ethnicity", and "Race" with label_encoder.gz (should be able to do joblib.load('label_encoder.gz')
    value_list[POS_DIAGNOSIS] = encoder_dx.transform([value_list[POS_DIAGNOSIS]])[0]
    value_list[POS_GENDER] = encoder_gender.transform([value_list[POS_GENDER]])[0]
    value_list[POS_ETHNICITY] = encoder_eth.transform([value_list[POS_ETHNICITY]])[0]
    value_list[POS_RACE] = encoder_race.transform([value_list[POS_RACE]])[0]
    
    # Scale the data in the json request (can use joblib.load('scaler.gz'). Note that you may have to reshape since it's a single sample
    feature_array = np.array(value_list).reshape(1,-1)
    features_scaled = scaler.transform(feature_array)
    
    return features_scaled


# API Methods

@app.get("/patient", response_model=Patient)
def patient(id: str = None):
    if id == None or id.strip() == "":
        raise HTTPException(status_code=400, detail="the server will not process this request due to missing patient.")
    
    record = query_db("SELECT * FROM patients WHERE patient_id='{}';".format(id), fetch_all=False)
    if (record == None):
        raise HTTPException(status_code=404, detail="Patient Not Found")
    patient_record = Patient(id=record[0], patient_id=record[1], created_at=record[2].isoformat())
    return patient_record

@app.post("/patient", status_code=201)
def patient(patient: str = None):
    if patient == None or patient.strip() == "":
        raise HTTPException(status_code=400, detail="the server will not process this request due to missing patient.")
    record = query_db("SELECT * FROM patients WHERE patient_id='{}';".format(patient), fetch_all=False)
    if (record is not None):
        raise HTTPException(status_code=400, detail="Patient already exists.")
    try:
        cursor = connection.cursor()
        cursor.execute("INSERT INTO patients(patient_id) VALUES('{}');".format(patient))
        connection.commit()
    except:
        connection.rollback()
        raise HTTPException(status_code=400, detail="the server could not process your request. Please try again.")
    return {"message": "Success"}

@app.get("/patient/record", response_model=Records)
def record(patient_id: str):
    records = query_db("SELECT id, patient_id, Diagnosis_at_Baseline, APOE4, MMSE, Age, Gender, Years_of_Education, Ethnicity, Race, ad_probability, created_at, updated_at FROM records WHERE patient_id='{}' ORDER BY updated_at DESC;".format(patient_id), fetch_all=True)
    if (records == []):
        raise HTTPException(status_code=404, detail="Patient History Not Found")
    final_records = []
    for record in records:
        final_record = Record(id=record[0],
                              patient_id=record[1],
                              Diagnosis_at_Baseline=record[2],
                              APOE4=record[3],
                              MMSE=record[4],
                              Age=record[5],
                              Gender=record[6],
                              Years_of_Education=record[7],
                              Ethnicity=record[8],
                              Race=record[9],
                              ad_probability=record[10] if record[10] is not None else -1,
                              created_at=record[11].isoformat(),
                              updated_at=record[12].isoformat())
        final_records.append(final_record)
    return Records(records=final_records)

@app.post("/patient/record", status_code=201)
def record(new_record: InputRecord):
    records = query_db("SELECT id, patient_id, Diagnosis_at_Baseline, APOE4, MMSE, Age, Gender, Years_of_Education, Ethnicity, Race, ad_probability FROM records WHERE patient_id='{}' and Diagnosis_at_Baseline='{}' and APOE4={} and MMSE={} and Age={} ORDER BY created_at ASC LIMIT 1;".format(new_record.patient_id, new_record.Diagnosis_at_Baseline, new_record.APOE4, new_record.MMSE, new_record.Age), fetch_all=True)
    if (records != []):
        raise HTTPException(status_code=400, detail="Record already exists")
    
    ## Get Patient to get Image Array from
    original_record = query_db("SELECT * FROM records WHERE patient_id='1' ORDER BY created_at ASC LIMIT 1;", fetch_all=True)
    ## Get Columns to create insert query
    columns = query_db("SELECT column_name FROM information_schema.columns WHERE table_name = 'records' order by ordinal_position ASC;", fetch_all=True)
    
    insert_query = "INSERT INTO records("
    for column in columns:
        if column[0] != "id" and column[0] != "created_at" and column[0] != "updated_at":
            insert_query = insert_query + column[0] + ","
    insert_query = insert_query[:len(insert_query)-1]
    insert_query = insert_query + ") VALUES("
    insert_query = insert_query + str(new_record.patient_id) + ","
    insert_query = insert_query + str(new_record.ad_probability) + ","
    insert_query = insert_query + "'" + str(new_record.Diagnosis_at_Baseline) + "',"
    insert_query = insert_query + str(new_record.Age) + ","
    insert_query = insert_query + "'" + str(new_record.Gender) + "',"
    insert_query = insert_query + str(new_record.Years_of_Education) + ","
    insert_query = insert_query +  "'" + str(new_record.Ethnicity) + "',"
    insert_query = insert_query +  "'" + str(new_record.Race) + "',"
    insert_query = insert_query + str(new_record.APOE4) + ","
    insert_query = insert_query + str(new_record.MMSE) + ","
    for value in range(11, len(original_record[0]) - 2):
        insert_query = insert_query + str(original_record[0][value]) + ","
    insert_query = insert_query[:len(insert_query)-1]
    insert_query = insert_query + ");"
    try:
        cursor = connection.cursor()
        cursor.execute(insert_query)
        connection.commit()
    except:
        connection.rollback()
        raise HTTPException(status_code=400, detail="the server could not process your request. Please try again.")
    return {"message": "Success"}

# TODO: Delete this when the DB code is running well
# Testing on GET for now
@app.get("/predict")
async def predict(id: str = None):
    try:
        # Pull Record for model
        record = query_db("SELECT * FROM records WHERE id='{}';".format(id), fetch_all=False)
        
        # Error message if patient not found
        if (record == None):
            return HTTPException(status_code=400, detail=f"Patient {id} not found in DB!")
            
        # Convert JSON string to model input
        arr = db_tuple_to_numpy(record)
        
        # Generate prediction
        prediction = model.predict(arr)[0][0]*100
        
        return {"ad_probability": prediction}
    except Exception as e:
        return HTTPException(status_code=400, detail=f"Error occurred: {str(e)}")

@app.get("/")
def root():
    # We are using the 404 Not Found error since this page is not implemented
    # and there is nothing to return.
    raise HTTPException(status_code=404, detail="not implemented")