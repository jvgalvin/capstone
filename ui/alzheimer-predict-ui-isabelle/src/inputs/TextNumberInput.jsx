function TextNumberInput({input_type = "N", name = "", input_text = "", handleChange, value}) {
  return (
    <label>
      {input_text}
      {input_type === "N" ? <input className="input-data" name={name} min="0" max="150" type="number" ref={value} onChange={handleChange} /> : <input className="input-data" name={name} maxLength="3" type="text" ref={value} onChange={handleChange} />}
    </label>
  )
}

export default TextNumberInput;
