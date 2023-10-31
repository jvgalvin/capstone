function ImagesInput({handleFileChange, handleRemoveFiles, selectedFilesRef, selectedFiles}) {
    return (
        <div>
            <input type="file" multiple onChange={handleFileChange} ref={selectedFilesRef}/>
            <div className="image-input-container">
                <ul>
                    {selectedFiles.map((fileName, index) => (
                    <li key={index}>{fileName}</li>
                    ))}
                </ul>
            </div>
            {selectedFiles.length > 0 && (
                <button onClick={handleRemoveFiles}>Remove Files</button>
            )}
        </div>
    )
}

export default ImagesInput;