import {v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
    })

}

export default connectCloudinary

const uploadOnCloudinary = async (localFilePath)=>{
    
    try {
        console.log(localFilePath)
        if(!localFilePath) return null;
            // if user give url or localfilepatth then we upload photo/vid on cloudinary
          const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
            //file is uploaded succesfully
            // console.log("file is uploaded on cloudinary successfully",response.url);

            fs.unlinkSync(localFilePath)
            return response;
            // this unlinkSync is used to clear the localfilepath from local system 
        } 
        catch (error) {
            fs.unlinkSync(localFilePath) //remove the locally saved temperory file as the upload operation is failed
            return null
        }
    }

export {uploadOnCloudinary}