from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import psycopg2
import json
import joblib

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
model = joblib.load("/workspaces/capstone/project/src/model.pkl")
scaler = joblib.load("/workspaces/capstone/project/src/scaler.gz")
label_encoder = joblib.load("/workspaces/capstone/project/src/label_encoder.gz")

class Patient(BaseModel):
    id: int
    patient_name: Optional[str] = None
    created_at: str

class Record(BaseModel):
    id: int
    patient_id: int
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
    patient_id: int
    Diagnosis_at_Baseline: str
    APOE4: int
    MMSE: int
    Age: float
    Gender: str
    Years_of_Education: int
    Ethnicity: str
    Race: str
    ad_probability: int

@app.get("/patient", response_model=Patient)
def patient(name: str = None):
    if name == None or name.strip() == "":
        raise HTTPException(status_code=400, detail="the server will not process this request due to missing patient.")
    
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM patients WHERE patient_name='{}';".format(name))
    record = cursor.fetchone()
    if (record == None):
        raise HTTPException(status_code=404, detail="Patient Not Found")
    patient_record = Patient(id=record[0], patient_name=record[1], created_at=record[2].isoformat())
    return patient_record

@app.post("/patient", status_code=201)
def patient(patient: str = None):
    if patient == None or patient.strip() == "":
        raise HTTPException(status_code=400, detail="the server will not process this request due to missing patient.")
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM patients WHERE patient_name='{}';".format(patient))
    record = cursor.fetchone()
    if (record is not None):
        raise HTTPException(status_code=400, detail="Patient already exists.")
    try:
        cursor = connection.cursor()
        cursor.execute("INSERT INTO patients(patient_name) VALUES('{}');".format(patient))
        connection.commit()
    except:
        connection.rollback()
        raise HTTPException(status_code=400, detail="the server could not process your request. Please try again.")
    return {"message": "Success"}

@app.get("/patient/record", response_model=Records)
def record(patient_id: int):
    cursor = connection.cursor()
    cursor.execute("SELECT id, patient_id, Diagnosis_at_Baseline, APOE4, MMSE, Age, Gender, Years_of_Education, Ethnicity, Race, ad_probability, created_at, updated_at FROM records WHERE patient_id='{}' ORDER BY updated_at DESC;".format(patient_id))
    records = cursor.fetchall()
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
    cursor = connection.cursor()
    cursor.execute("SELECT id, patient_id, Diagnosis_at_Baseline, APOE4, MMSE, Age, Gender, Years_of_Education, Ethnicity, Race, ad_probability FROM records WHERE patient_id='{}' and Diagnosis_at_Baseline='{}' and APOE4={} and MMSE={} and Age={} ORDER BY created_at ASC LIMIT 1;".format(new_record.patient_id, new_record.Diagnosis_at_Baseline, new_record.APOE4, new_record.MMSE, new_record.Age))
    records = cursor.fetchall()
    if (records != []):
        raise HTTPException(status_code=400, detail="Record already exists")
    
    ## Get Patient to get Image Array from
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM records WHERE patient_id='1' ORDER BY created_at ASC LIMIT 1;")
    original_record = cursor.fetchall()
    ## Get Columns to create insert query
    cursor = connection.cursor()
    cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'records' order by ordinal_position ASC;")
    columns = cursor.fetchall()
    insert_query = "INSERT INTO records("
    for column in columns:
        if column[0] != "id" and column[0] != "created_at" and column[0] != "updated_at":
            insert_query = insert_query + column[0] + ","
    insert_query = insert_query[:len(insert_query)-1]
    insert_query = insert_query + ") VALUES("
    insert_query = insert_query + str(new_record.patient_id) + ","
    insert_query = insert_query + "'" + str(new_record.Diagnosis_at_Baseline) + "',"
    insert_query = insert_query + str(new_record.APOE4) + ","
    insert_query = insert_query + str(new_record.MMSE) + ","
    insert_query = insert_query + str(new_record.Age) + ","
    insert_query = insert_query + "'" + str(new_record.Gender) + "',"
    insert_query = insert_query + str(new_record.Years_of_Education) + ","
    insert_query = insert_query +  "'" + str(new_record.Ethnicity) + "',"
    insert_query = insert_query +  "'" + str(new_record.Race) + "',"
    insert_query = insert_query + str(new_record.ad_probability) + ","
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

@app.post("/predict")
async def predict():
    return None

@app.get("/")
def root():
    # We are using the 404 Not Found error since this page is not implemented
    # and there is nothing to return.
    raise HTTPException(status_code=404, detail="not implemented")