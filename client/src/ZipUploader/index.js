import { useState } from "react";
import axios from "axios";

export default function ZipUploader() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("zipFile", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setMessage("Error uploading file");
    }
  };

  return (
    <div>
      <input type="file" accept=".zip" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <pre>{message}</pre>
    </div>
  );
}
