function ResultInput({resultValue}) {
    return (
      <label>
        AD Probability
        <input className="result-input-data" step="any" type="number" ref={resultValue} readOnly={true}></input>
      </label>
    )
  }
  
  export default ResultInput;