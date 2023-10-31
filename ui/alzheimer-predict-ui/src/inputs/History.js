function History({history}) {
    return (
        <div>
        {history.map((item) => (
                <p>
                    APOE4: {item["APOE4"]}, MMSE: {item["MMSE"]}, Age: {item["Age"]}, Gender: {item["Gender"]}, Years_of_Education: {item["Years_of_Education"]}, Race: {item["Race"]}, ad_probability: {item["ad_probability"] > -1 ? item["ad_probability"] : ""}
                </p>
            ))}
        </div>
    )
  }
  
  export default History;