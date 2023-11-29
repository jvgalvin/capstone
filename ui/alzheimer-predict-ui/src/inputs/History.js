function History({history}) {
    let date_formatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    })
    return (
        <div className="history-container">
        {history.map((item) => (
                <div className="history-row">
                    Created At: {date_formatter.format(new Date(item["created_at"]))}, APOE4: {item["APOE4"]}, MMSE: {item["MMSE"]}, Age: {item["Age"]}, Gender: {item["Gender"]}, Years_of_Education: {item["Years_of_Education"]}, Race: {item["Race"]}, ad_probability: {item["ad_probability"] > -1 ? item["ad_probability"] : ""}
                </div>
            ))}
        </div>
    )
  }
  
  export default History;