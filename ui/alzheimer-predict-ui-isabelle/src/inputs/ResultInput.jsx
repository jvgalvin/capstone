function ResultInput({resultValue}) {
    return (
      <label>
        AD Probability
        <input className="input-data" type="number" ref={resultValue} readOnly={true}></input>
      </label>
    )
  }
  
  export default ResultInput;