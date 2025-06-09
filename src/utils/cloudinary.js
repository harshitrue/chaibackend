import { v2 as cloudinary } from 'cloudinary'
import { log } from 'console';
import fs from 'fs'



cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localfilePath) => {
    try {
        if (!localfilePath) return null
        //upload the file to cloudinary
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto"
        })   //file uploaded successfully
        console.log("File uploaded successfully to Cloudinary:", response.url);
        return response
    } catch (error) {
        fs.unlinkSync(localfilePath) //delete the file from local storage
        console.error("Error uploading file to Cloudinary:", error);
        return null;
    }
}

export {uploadOnCloudinary}