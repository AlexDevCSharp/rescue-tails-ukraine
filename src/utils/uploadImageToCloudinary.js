import axios from "axios";

export const uploadImageToCloudinary = async (file, setUploading) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "rescuetails_preset"); 

  try {
    setUploading?.(true); 
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/c-19bb0bd05628c71aa4a984bde71290/image/upload", 
      formData
    );
    return res.data.secure_url;
  } catch (err) {
    console.error("Upload failed:", err);
    return null;
  } finally {
    setUploading?.(false);
  }
};
