import { useState, useRef } from 'react';
import './stylesheets/App.css';
import './stylesheets/TextNumberInput.css'
import './stylesheets/ImagesInput.css'
import './stylesheets/SearchBar.css'
import TextNumberInput from './inputs/TextNumberInput.js';
import ResultInput from './inputs/ResultInput';
import ImagesInput from './inputs/ImagesInput';
import SearchBar from './inputs/SearchBar';
import { getPatientHistory } from './DatabaseConnection.js';

function App() {

  // TextNumberInput value updates to have submit form include all values needed.
  const [inputs, setInputs] = useState({}); //Used for input values
  const adProbability = useRef(); //Used for AD Probability Result
  const [selectedFiles, setSelectedFiles] = useState([]); //Used for storing file names
  const selectedFilesRef = useRef();
  const [patient, setPatient] = useState({});
  const [history, setHistory] = useState([]);

  const alleles = useRef();
  const mmse = useRef();
  const age = useRef();
  const gender = useRef();
  const education = useRef();
  const race = useRef();

  //Handle finding Patient
  const handleFoundPatient = async (patient) => {
    console.log("HERE");
    console.log(patient);
    let history = await getPatientHistory(patient["suggestion"]["id"]);
    console.log(history)
    setHistory(history["records"]);
    setInputs({
      "alleles": history["records"][0]["alleles"],
      "mmse": history["records"][0]["mmse"],
      "age": history["records"][0]["age"],
      "gender": history["records"][0]["gender"],
      "education": history["records"][0]["education"],
      "race": history["records"][0]["race"],
      "ad_probability": history["records"][0]["ad_probability"]
    });
    alleles.current.value = history["records"][0]["alleles"]
    mmse.current.value = history["records"][0]["mmse"]
    age.current.value = history["records"][0]["age"]
    gender.current.value = history["records"][0]["gender"]
    education.current.value = history["records"][0]["education"]
    race.current.value = history["records"][0]["race"]
    adProbability.current.value = (history["records"][0]["ad_probability"] > -1) ? history["records"][0]["ad_probability"] : undefined
    setPatient(patient);
  }

  //Handle input changes
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}));
  }

  //Handle Image input changes
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const fileNames = files.map((file) => file.name);
    setSelectedFiles(fileNames);
  };

  //Handle Image removal changes
  const handleRemoveFiles = () => {
    setSelectedFiles([]); // Clear the selected files
    selectedFilesRef.current.value = '';
  };

  // Submit form
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(selectedFiles.length)
    console.log(Object.keys(inputs).length)
    if(Object.keys(inputs).length < 6 || selectedFiles.length < 1 || selectedFiles.length > 50) {
      alert("Please enter all fields")
    } else {
      for (const key in inputs) {
        console.log(key + " value: " + inputs[key]);
      }
      alert(inputs)
      adProbability.current.value = 71;
    }
  }

  return (
    <div className="container">
      <div>
        <h2>Search By Name Or Patient ID</h2>
        < SearchBar handleFoundPatient={handleFoundPatient}/>
        <form onSubmit={handleSubmit}>
          <h2>Upload Images</h2>
          <ImagesInput handleFileChange={handleFileChange} handleRemoveFiles={handleRemoveFiles} selectedFilesRef={selectedFilesRef} selectedFiles={selectedFiles} />
          <h2>APOE4 Allele Information</h2>
          <TextNumberInput input_type = 'N' name = 'alleles' input_text = 'How many copies of the 4 allele does this individual have?'handleChange={handleChange} value={alleles} />
          <h2>Clinical Information</h2>
          <div className="form-data">
            <TextNumberInput input_type = 'N' name = 'mmse' input_text = 'MMSE Score:' handleChange={handleChange} value={mmse} />
            <TextNumberInput input_type = 'N' name = 'age'input_text = 'Age:' handleChange={handleChange} value={age} />
            <TextNumberInput input_type = 'T' name = 'gender' input_text = 'Gender:' handleChange={handleChange} value={gender} />
            <TextNumberInput input_type = 'N' name = 'education' input_text = 'Education:' handleChange={handleChange} value={education} />
            <TextNumberInput input_type = 'T' name = 'race' input_text = 'Race:' handleChange={handleChange} value={race} />
          </div>
          <div className="submit-container">
            <input type="submit" />
          </div>
        </form>
      </div>
      <div>
        <h2>Patient History</h2>
        <div>
        {history.map((item) => (
                <p>
                    alleles: {item["alleles"]}, mmse: {item["alleles"]}, age: {item["age"]}, gender: {item["gender"]}, education: {item["education"]}, race: {item["race"]}, ad_probability: {item["ad_probability"]}
                </p>
            ))}
        </div>
        <ResultInput resultValue={adProbability} />
      </div>
    </div>
  );
}

export default App;
