from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
import json

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
connection = psycopg2.connect(database="alzheimer_predict", user="alzheimer_predict_user", password="12345678", host="localhost", port=5432)

class Patient(BaseModel):
    id: int
    patient_name: str
    created_at: str

class Record(BaseModel):
    id: int
    patient_id: int
    alleles: int
    mmse: int
    age: int
    gender: str
    education: int
    race: str
    ad_probability: int
    created_at: str
    updated_at: str

class Records(BaseModel):
    records = [Record]

@app.get("/patient", response_model=Patient)
def patient(name: str | None = None):
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
def patient(patient: str | None = None):
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
    cursor.execute("SELECT * FROM records WHERE patient_id='{}';".format(patient_id))
    records = cursor.fetchall()
    if (records == []):
        raise HTTPException(status_code=404, detail="Patient History Not Found")
    final_records = []
    for record in records:
        final_record = Record(id=record[0],
                              patient_id=record[1],
                              alleles=record[2],
                              mmse=record[3],
                              age=record[4],
                              gender=record[5],
                              education=record[6],
                              race=record[7],
                              ad_probability=record[8] if record[8] is not None else -1,
                              created_at=record[9].isoformat(),
                              updated_at=record[10].isoformat())
        final_records.append(final_record)
    return Records(records=final_records)

@app.post("/patient/record", status_code=201)
def record(patient_id: int,
            alleles: int,
            mmse: int,
            age: int,
            gender: str,
            education: int,
            race: str,
            ad_probability: int):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM records WHERE patient_id='{}' and alleles={} and mmse={} and age={};".format(patient_id, alleles, mmse, age))
    records = cursor.fetchall()
    print(records)
    if (records != []):
        raise HTTPException(status_code=400, detail="Record already exists")
    try:
        cursor = connection.cursor()
        cursor.execute("INSERT INTO records(patient_id, alleles, mmse, age, gender, education, race, ad_probability) VALUES({}, {}, {}, {}, '{}', {}, '{}', {});".format(patient_id,
                                                                                                                                                                        alleles,
                                                                                                                                                                        mmse,
                                                                                                                                                                        age,
                                                                                                                                                                        gender,
                                                                                                                                                                        education,
                                                                                                                                                                        race,
                                                                                                                                                                        ad_probability))
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