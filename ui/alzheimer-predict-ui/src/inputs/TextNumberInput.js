function TextNumberInput({input_type = "N", name = "", input_text = "", handleChange, value}) {
  return (
    <label>
      <div class="d-flex flex-row mb-1">
          <div className="input-label">
            {input_text}
          </div>
          <div className="input-container">
            {input_type === "N" ? <input className="input-data" name={name} min="0" max="150" step="any" type="number" ref={value} onChange={handleChange} /> : <input className="input-data" name={name} maxLength="3" type="text" ref={value} onChange={handleChange} />}
          </div>
        </div>
    </label>
  )
}

export default TextNumberInput;
