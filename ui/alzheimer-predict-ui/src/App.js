import { useState, useRef } from 'react';
import './stylesheets/App.css';
import './stylesheets/TextNumberInput.css'
import './stylesheets/ImagesInput.css'
import './stylesheets/SearchBar.css'
import TextNumberInput from './inputs/TextNumberInput.js';
import ResultInput from './inputs/ResultInput';
import SearchBar from './inputs/SearchBar';
import History from './inputs/History';
import { getPatientHistory, addPatient, getPatientByNameID } from './DatabaseConnection.js';

function App() {

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

  //Handle finding Patient
  const handleFoundPatient = async (patient_suggestion) => {
    console.log(patient_suggestion);
    let history = await getPatientHistory(patient_suggestion["suggestion"]["id"]);
    console.log(history)
    setHistory(history["records"]);
    setInputs({
      "APOE4": history["records"][0]["APOE4"],
      "MMSE": history["records"][0]["MMSE"],
      "Age": history["records"][0]["Age"],
      "Gender": history["records"][0]["Gender"],
      "Years_of_Education": history["records"][0]["Years_of_Education"],
      "Race": history["records"][0]["Race"],
      "ad_probability": history["records"][0]["ad_probability"]
    });
    APOE4.current.value = history["records"][0]["APOE4"]
    MMSE.current.value = history["records"][0]["MMSE"]
    Age.current.value = history["records"][0]["Age"]
    Gender.current.value = history["records"][0]["Gender"]
    Years_of_Education.current.value = history["records"][0]["Years_of_Education"]
    Race.current.value = history["records"][0]["Race"]
    adProbability.current.value = (history["records"][0]["ad_probability"] > -1) ? history["records"][0]["ad_probability"] : undefined
    setPatient(patient_suggestion["suggestion"]);
    console.log("TEST")
    console.log(patient)
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
      if(Object.keys(patient_in_memory).length == 0) {
        await addPatient(patientName)
        patient_in_memory = await getPatientByNameID(patientName)
        console.log(patient_in_memory)
        setPatient(patient_in_memory)
      }
      console.log(patient_in_memory)
      for (const key in inputs) {
        console.log(key + " value: " + inputs[key]);
      }
      console.log(inputs)
      adProbability.current.value = 71;
    }
  }

  return (
    <div className="container">
      <div>
        <h2>Enter Name / Search By Name Or Patient ID</h2>
        < SearchBar handleFoundPatient={handleFoundPatient} handlePatientNameEntered={handlePatientNameEntered}/>
        <form onSubmit={handleSubmit}>
          <h2>APOE4 Allele Information</h2>
          <TextNumberInput input_type = 'N' name = 'APOE4' input_text = 'How many copies of the 4 allele does this individual have?'handleChange={handleChange} value={APOE4} />
          <h2>Clinical Information</h2>
          <div className="form-data">
            <TextNumberInput input_type = 'N' name = 'MMSE' input_text = 'MMSE Score:' handleChange={handleChange} value={MMSE} />
            <TextNumberInput input_type = 'N' name = 'Age'input_text = 'Age:' handleChange={handleChange} value={Age} />
            <TextNumberInput input_type = 'T' name = 'Gender' input_text = 'Gender:' handleChange={handleChange} value={Gender} />
            <TextNumberInput input_type = 'N' name = 'Years_of_Education' input_text = 'Education:' handleChange={handleChange} value={Years_of_Education} />
            <TextNumberInput input_type = 'T' name = 'Race' input_text = 'Race:' handleChange={handleChange} value={Race} />
          </div>
          <div className="submit-container">
            <input type="submit" />
          </div>
        </form>
      </div>
      <div>
        <h2>Patient History</h2>
        <History history={history}/>
        <ResultInput resultValue={adProbability} />
      </div>
    </div>
  );
}

export default App;
