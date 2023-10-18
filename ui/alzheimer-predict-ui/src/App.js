import { useState, useRef } from 'react';
import './stylesheets/App.css';
import './stylesheets/TextNumberInput.css'
import './stylesheets/ImagesInput.css'
import './stylesheets/SearchBar.css'
import TextNumberInput from './inputs/TextNumberInput.js';
import ResultInput from './inputs/ResultInput';
import ImagesInput from './inputs/ImagesInput';
import SearchBar from './inputs/SearchBar';

function App() {

  // TextNumberInput value updates to have submit form include all values needed.
  const [inputs, setInputs] = useState({}); //Used for input values
  const resultValue = useRef(); //Used for AD Probability Result
  const [selectedFiles, setSelectedFiles] = useState([]); //Used for storing file names
  const selectedFilesRef = useRef();
  const [patient, setPatient] = useState({});
  const alleles = useRef();
  const mmse = useRef();
  const age = useRef();
  const gender = useRef();
  const education = useRef();
  const race = useRef();

  //Handle finding Patient
  const handleFoundPatient = (suggestion) => {
    console.log("HERE");
    console.log(suggestion["suggestion"]);
    setInputs({
      "alleles": suggestion["suggestion"]["alleles"],
      "mmse": suggestion["suggestion"]["mmse"],
      "age": suggestion["suggestion"]["age"],
      "gender": suggestion["suggestion"]["gender"],
      "education": suggestion["suggestion"]["education"],
      "race": suggestion["suggestion"]["race"],
    });
    alleles.current.value = suggestion["suggestion"]["alleles"]
    mmse.current.value = suggestion["suggestion"]["mmse"]
    age.current.value = suggestion["suggestion"]["age"]
    gender.current.value = suggestion["suggestion"]["gender"]
    education.current.value = suggestion["suggestion"]["education"]
    race.current.value = suggestion["suggestion"]["race"]
    setPatient(suggestion["suggestion"]);
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
      resultValue.current.value = 71;
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
        <ResultInput resultValue={resultValue} />
      </div>
    </div>
  );
}

export default App;
