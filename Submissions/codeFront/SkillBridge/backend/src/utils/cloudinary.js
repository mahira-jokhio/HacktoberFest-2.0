import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
// import logger from "./logger.js";

dotenv.config();

//configure cloudinary
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File uploaded on cloudinary. File src: ", response.url);
    //once the file is uploaded we woould like to delete from our server
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("CLOUDINARY ERROR: ", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    console.log("Deleted from cloudinary", result, " Public Id ", publicId);
  } catch (error) {
    console.error("Error deleting  from cloudinary", error);
  }
};
const deleteVideoFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    console.log("Deleted from cloudinary", result, " Public Id ", publicId);
  } catch (error) {
    console.error("Error deleting  from cloudinary", error);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary, deleteVideoFromCloudinary };