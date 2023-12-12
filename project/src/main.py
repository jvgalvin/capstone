from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

import json
import joblib
import numpy as np
import os
import pandas as pd
import psycopg2


if os.environ.get('MODEL_OBJECT_PATH') is None:
    OBJECT_PATH = "/workspaces/capstone/project/src/"
    #OBJECT_PATH = "./src/"
else:
    OBJECT_PATH = str(os.environ.get('MODEL_OBJECT_PATH'))

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

# Prevented initializing the variable upon startup to avoid crashing on Kubernetes startup
sql_connection = None

# Import Model-related objects
model = joblib.load(OBJECT_PATH + "model.pkl")
scaler = joblib.load(OBJECT_PATH + "scaler.gz")
encoder_dx = joblib.load(OBJECT_PATH + "encoder_dx.gz")
encoder_eth = joblib.load(OBJECT_PATH + "encoder_eth.gz")
encoder_gender = joblib.load(OBJECT_PATH + "encoder_gender.gz")
encoder_race = joblib.load(OBJECT_PATH + "encoder_race.gz")

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
    ad_probability: float
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
    ad_probability: float

# Helper Methods
def get_sql_connection():
    global sql_connection
    if sql_connection is None:
        sql_connection = psycopg2.connect(database="alzheimer_predict", user="alzheimer_predict_user", password="12345678", host="localhost", port=5432)
    
    return sql_connection

def query_db(connection, query_str, fetch_all=False):
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
    connection = get_sql_connection()
    try:
        record = query_db(connection, "SELECT * FROM patients WHERE patient_id='{}';".format(id), fetch_all=False)
        if (record == None):
            raise HTTPException(status_code=404, detail="Patient Not Found")
        patient_record = Patient(id=record[0], patient_id=record[1], created_at=record[2].isoformat())
        return patient_record
    except HTTPException as e:
        connection.rollback()
        raise e
    except:
        connection.rollback()
        raise HTTPException(status_code=400, detail="the server could not process your request. Please try again.")

@app.post("/patient", status_code=201)
def patient(patient: str = None):
    if patient == None or patient.strip() == "":
        raise HTTPException(status_code=400, detail="the server will not process this request due to missing patient.")
    connection = get_sql_connection()
    try:
        record = query_db(connection, "SELECT * FROM patients WHERE patient_id='{}';".format(patient), fetch_all=False)
        if (record is not None):
            raise HTTPException(status_code=400, detail="Patient already exists.")
        cursor = connection.cursor()
        cursor.execute("INSERT INTO patients(patient_id) VALUES('{}');".format(patient))
        connection.commit()
    except HTTPException as e:
        connection.rollback()
        raise e
    except:
        connection.rollback()
        raise HTTPException(status_code=400, detail="the server could not process your request. Please try again.")
    return {"message": "Success"}

@app.get("/patient/record", response_model=Records)
def record(patient_id: str):
    connection = get_sql_connection()
    try:
        records = query_db(connection, "SELECT id, patient_id, Diagnosis_at_Baseline, APOE4, MMSE, Age, Gender, Years_of_Education, Ethnicity, Race, ad_probability, created_at, updated_at FROM records WHERE patient_id='{}' ORDER BY updated_at DESC;".format(patient_id), fetch_all=True)
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
    except HTTPException as e:
        connection.rollback()
        raise e
    except:
        connection.rollback()
        raise HTTPException(status_code=400, detail="the server could not process your request. Please try again.")

@app.post("/patient/record", status_code=201)
def record(new_record: InputRecord):
    connection = get_sql_connection()
    try:
        records = query_db(connection, "SELECT id, patient_id, Diagnosis_at_Baseline, APOE4, MMSE, Age, Gender, Years_of_Education, Ethnicity, Race, ad_probability FROM records WHERE patient_id='{}' and Diagnosis_at_Baseline='{}' and APOE4={} and MMSE={} and Age={} ORDER BY created_at ASC LIMIT 1;".format(new_record.patient_id, new_record.Diagnosis_at_Baseline, new_record.APOE4, new_record.MMSE, new_record.Age), fetch_all=True)
        if (records != []):
            raise HTTPException(status_code=400, detail="Record already exists")
        
        ## Get Patient to get Image Array from
        original_record = query_db(connection, "SELECT * FROM records WHERE patient_id='{}' ORDER BY created_at ASC LIMIT 1;".format(new_record.patient_id), fetch_all=True)
        if original_record == []:
            original_record = query_db(connection, "SELECT * FROM records WHERE patient_id='022_S_0004' ORDER BY created_at ASC LIMIT 1;", fetch_all=True)
        ## Get Columns to create insert query
        columns = query_db(connection, "SELECT column_name FROM information_schema.columns WHERE table_name = 'records' order by ordinal_position ASC;", fetch_all=True)
        
        insert_query = "INSERT INTO records("
        for column in columns:
            if column[0] != "id" and column[0] != "created_at" and column[0] != "updated_at":
                insert_query = insert_query + column[0] + ","
        insert_query = insert_query[:len(insert_query)-1]
        insert_query = insert_query + ") VALUES('"
        insert_query = insert_query + str(new_record.patient_id) + "',"
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

        cursor = connection.cursor()
        cursor.execute(insert_query)
        connection.commit()
    except HTTPException as e:
        connection.rollback()
        raise e
    except:
        connection.rollback()
        raise HTTPException(status_code=400, detail="the server could not process your request. Please try again.")
    return {"message": "Success"}

@app.put("/patient/record", status_code=200)
def record(update_record: InputRecord):
    connection = get_sql_connection()
    try:
        print(update_record)
        insert_query = "UPDATE records SET ad_probability = {} WHERE patient_id = '{}' and Diagnosis_at_Baseline = '{}' and Age = {} and APOE4 = {} and MMSE = {}".format(update_record.ad_probability, update_record.patient_id, update_record.Diagnosis_at_Baseline, update_record.Age, update_record.APOE4, update_record.MMSE)
        print(insert_query)
        cursor = connection.cursor()
        cursor.execute(insert_query)
        connection.commit()
    except HTTPException as e:
        connection.rollback()
        raise e
    except:
        connection.rollback()
        raise HTTPException(status_code=400, detail="the server could not process your request. Please try again.")
    return {"message": "Success"}

@app.get("/predict")
async def predict(id: str = None):
    try:
        connection = get_sql_connection()
        # Pull most recent Record for model
        record = query_db(connection, "SELECT * FROM records WHERE patient_id='{}' Order by created_at DESC limit 1;".format(id), fetch_all=False)

        # Error message if patient not found
        if (record == None):
            raise HTTPException(status_code=400, detail=f"Record {id} not found in DB!")
        
        # Convert JSON string to model input
        arr = db_tuple_to_numpy(record)
        
        # Generate prediction
        prediction = model.predict(arr)[0][0]*100

        return {"ad_probability": round(prediction,2)}
    except HTTPException as e:
        connection.rollback()
        raise e
    except Exception as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=f"Error occurred: {str(e)}")

@app.get("/reset")
def reset():
    try:
        connection = get_sql_connection()
        
        connection.rollback()
        
        return {"message": "connection rollback successful"}
    except Exception as e:
        return HTTPException(status_code=400, detail=f"Error occurred: {str(e)}")

@app.get("/")
def root():
    # We are using the 404 Not Found error since this page is not implemented
    # and there is nothing to return.
    return {"message": "root"}