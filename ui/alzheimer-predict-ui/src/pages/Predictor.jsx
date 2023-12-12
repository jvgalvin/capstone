import { useState, useRef } from 'react';
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import '../stylesheets/App.css';
import '../stylesheets/TextNumberInput.css'
import '../stylesheets/SearchBar.css'
import '../stylesheets/ResultInput.css'
import '../stylesheets/History.css'
import TextNumberInput from '../inputs/TextNumberInput.js';
import ResultInput from '../inputs/ResultInput';
import SearchBar from '../inputs/SearchBar';
import History from '../inputs/History';
import { getPatientHistory, addPatient, getPatientByNameID, addHistoryForPatient, getPrediction, updateHistoryForPatient } from '../DatabaseConnection.js';

function Predictor() {

  // TextNumberInput value updates to have submit form include all values needed.
  const [inputs, setInputs] = useState({}); //Used for input values
  const adProbability = useRef(); //Used for AD Probability Result
  const [patient, setPatient] = useState({});
  const [patientName, setPatientName] = useState("");
  const [history, setHistory] = useState([]);

  const APOE4 = useRef();
  const MMSE = useRef();
  const Age = useRef();
  const Gender = useRef();
  const Years_of_Education = useRef();
  const Race = useRef();
  const Diagnosis_at_Baseline = useRef();
  const Ethnicity = useRef();

  //Handle finding Patient
  const handleFoundPatient = async (patient_suggestion) => {
    console.log(patient_suggestion);
    if(patient_suggestion !== null) {
      let history = await getPatientHistory(patient_suggestion["suggestion"]["patient_id"]);
      console.log(history)
      setHistory(history["records"]);
      setInputs({
        "APOE4": history["records"][0]["APOE4"],
        "MMSE": history["records"][0]["MMSE"],
        "Age": history["records"][0]["Age"],
        "Gender": history["records"][0]["Gender"],
        "Years_of_Education": history["records"][0]["Years_of_Education"],
        "Race": history["records"][0]["Race"],
        "Diagnosis_at_Baseline": history["records"][0]["Diagnosis_at_Baseline"],
        "Ethnicity": history["records"][0]["Ethnicity"],
        "ad_probability": history["records"][0]["ad_probability"]
      });
      APOE4.current.value = history["records"][0]["APOE4"]
      MMSE.current.value = history["records"][0]["MMSE"]
      Age.current.value = history["records"][0]["Age"]
      Gender.current.value = history["records"][0]["Gender"]
      Years_of_Education.current.value = history["records"][0]["Years_of_Education"]
      Race.current.value = history["records"][0]["Race"]
      Diagnosis_at_Baseline.current.value = history["records"][0]["Diagnosis_at_Baseline"]
      Ethnicity.current.value = history["records"][0]["Ethnicity"]
      adProbability.current.value = (history["records"][0]["ad_probability"] > -1) ? history["records"][0]["ad_probability"] : null
      setPatient(patient_suggestion["suggestion"]);
      console.log("TEST")
      console.log(patient)
    } else {
      setHistory([])
      setInputs({})
      setPatient({})
      APOE4.current.value = null
      MMSE.current.value = null
      Age.current.value = null
      Gender.current.value = null
      Years_of_Education.current.value = null
      Race.current.value = null
      Diagnosis_at_Baseline.current.value = null
      Ethnicity.current.value = null
      adProbability.current.value = null
    }
  }

  //Handle Patient name entered on search bar
  const handlePatientNameEntered = (event) => {
    setPatientName(event.target.value);
    console.log(patientName);
  }

  //Handle input changes
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}));
  }

  // Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(Object.keys(inputs).length)
    console.log(patientName.length)
    if(Object.keys(inputs).length < 6) {
      alert("Please enter all fields")
    } else if(patientName.length < 1) {
      alert("Please enter Patient name")
    } else {
      let patient_in_memory = patient
      if(patient_in_memory == null || Object.keys(patient_in_memory).length === 0) {
        await addPatient(patientName)
        patient_in_memory = await getPatientByNameID(patientName)
        console.log(patient_in_memory)
        setPatient(patient_in_memory)
      }
      console.log(patient_in_memory)
      let final_inputs = inputs
      final_inputs["patient_id"] = patient_in_memory.patient_id
      final_inputs["ad_probability"] = final_inputs["ad_probability"] != null ? final_inputs["ad_probability"] : -1
      for (const key in final_inputs) {
        console.log(key + " value: " + final_inputs[key]);
      }
      console.log(final_inputs)
      //adProbability.current.value = 71;
      let result = await addHistoryForPatient(final_inputs)
      if(!(result instanceof Error)) {
        // if(final_inputs["ad_probability"] == -1) {
        let prediction = await getPrediction(final_inputs["patient_id"])
        console.log("Prediction: " + prediction["ad_probability"]);
        final_inputs["ad_probability"] = prediction["ad_probability"]
        adProbability.current.value = prediction["ad_probability"]
        let result = await updateHistoryForPatient(final_inputs)
        console.log(result)
        if(!(result instanceof Error)) {
          alert("Success Saving Patient " + patient_in_memory.patient_id)
        } else {
          alert("There was an error Saving Patient " + result)
        }
        // } else {
        //   alert("Success Saving Patient " + patient_in_memory.patient_id)
        // }
      } else {
        console.log("There was an error Saving Patient " + patient_in_memory.patient_id)
        // if(final_inputs["ad_probability"] == -1) {
        let prediction = await getPrediction(final_inputs["patient_id"])
        console.log("Prediction: " + prediction["ad_probability"]);
        final_inputs["ad_probability"] = prediction["ad_probability"]
        adProbability.current.value = prediction["ad_probability"]
        let result = await updateHistoryForPatient(final_inputs)
        console.log(result)
        if(!(result instanceof Error)) {
          alert("Success Saving Patient " + patient_in_memory.patient_id)
        } else {
          alert("There was an error Saving Patient " + result)
        }
        // } else {
        //   alert("There was an error Saving Patient " + result)
        // }
      }
    }
  }

  return (
    <Container fluid={true}>
      <Row>
        <h2>Instructions</h2>
        <p><b>For patients in the database:</b> Type patient ID and hit ENTER. Available data will pre-populate in the remaining fields. If necessary, modify any values, otherwise, click Submit and read the prediction from "AD Probability".</p>
        <p><b>For patients NOT in the database:</b> Leave patient ID blank. Enter available data in the blank fields. Click Submit and read the prediction from "AD Probability".</p>
      <Col>
        <Stack gap={3}>
        <h2>Enter Patient ID</h2>
        < SearchBar handleFoundPatient={handleFoundPatient} handlePatientNameEntered={handlePatientNameEntered}/>
        <form onSubmit={handleSubmit}>
          <h2>Alzheimer's-Specific Information</h2>
          <div className="form-data">
          <label>
              <div class="d-flex flex-row mb-1">
                <div className="input-label">
                Current Diagnosis:
                </div>
                <div className="input-container">
                  <select className="input-data" name= 'Diagnosis_at_Baseline' onChange={handleChange} ref={Diagnosis_at_Baseline}>
                      <option selected value="" />
                      <option value="CN">Normal Cognitive Function</option>
                      <option value="LMCI">Mild Cognitive Impairment</option>
                  </select>
                </div>
              </div>
            </label>
            <TextNumberInput input_type = 'N' name = 'APOE4' input_text = 'Number of copies of the APOE4 allele (0-4):'handleChange={handleChange} value={APOE4} />
            <TextNumberInput input_type = 'N' name = 'MMSE' input_text = 'Most recent score on the Mini-Mental State Exam (MMSE):' handleChange={handleChange} value={MMSE} />
          </div>
          <h2>Additional Information</h2>
          <div className="form-data">
            <TextNumberInput input_type = 'N' name = 'Age'input_text = 'Age:' handleChange={handleChange} value={Age} />
            <label>
              <div class="d-flex flex-row mb-1">
                <div className="input-label">
                  Gender:
                </div>
                <div className="input-container">
                  <select className="input-data" name= 'Gender' onChange={handleChange} ref={Gender}>
                      <option selected value="" />
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </label>
            <label>
              <div class="d-flex flex-row mb-1">
                <div className="input-label">
                  Race:
                </div>
                <div className="input-container">
                  <select className="input-data" name= 'Race' onChange={handleChange} ref={Race}>
                      <option selected value="" />
                      <option value="White">White</option>
                      <option value="Black">Black</option>
                      <option value="Asian">Asian</option>
                      <option value="Am Indian/Alaskan">Am Indian/Alaskan</option>
                      <option value="Hawaiian/Other PI">Hawaiian/Other PI</option>
                      <option value="More than one">More than one</option>
                  </select>
                </div>
              </div>
            </label>
            <label>
              <div class="d-flex flex-row mb-1">
                <div className="input-label">
                  Ethnicity:
                </div>
                <div className="input-container">
                  <select className="input-data" name= 'Ethnicity' onChange={handleChange} ref={Ethnicity}>
                      <option selected value="" />
                      <option value="Hisp/Latino">Hisp/Latino</option>
                      <option value="Not Hisp/Latino">Not Hisp/Latino</option>
                  </select>
                </div>
              </div>
            </label>
            <TextNumberInput input_type = 'N' name = 'Years_of_Education' input_text = 'Years of Education:' handleChange={handleChange} value={Years_of_Education} />
          </div>
          <div className="submit-container">
            <Button variant="contained" type="submit">Submit</Button>
          </div>
        </form>
        </Stack>
      </Col>
      <Col>
      <Stack gap={4}>
      <div className="p-2">
        <h2>Patient History</h2>
        <History history={history}/>
        <ResultInput resultValue={adProbability} />
      </div>
      <div className="p-2">
      <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="body2">
        Our machine learning model has predicted the probability that you may develop Alzheimer’s Disease within the next 5 years. 
        </Typography>
        <br></br>
      </CardContent>
      <CardActions>
        <Button size="small" as={Link} to="/resources">Now What?</Button>
      </CardActions>
    </Card>
    </div>
    </Stack>
      </Col>
    </Row>
  </Container>
  );
}

export default Predictor;
