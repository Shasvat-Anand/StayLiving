// const cloudinary = require('cloudinary').v2;
// const {CloudinaryStorage}  = require('multer-storage-cloudinary');

// cloudinary.config({
//     cloud_name : process.env.CLOUD_NAME,
//     api_key:process.env.CLOUD_API_KEY,
//     api_secret : process.env.CLOUD_API_SECRET,
// })

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'StayLiving',
//     allowerdFormats: ["png", "jpg", "jpeg"], 

//   },
// });

 
// module.exports = {
//     cloudinary,
//     storage,
// }


const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multer.memoryStorage();

// Helper function to upload a file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, mimetype) => {
    return new Promise((resolve, reject) => {
        const b64 = Buffer.from(fileBuffer).toString('base64');
        const dataURI = `data:${mimetype};base64,${b64}`;

        cloudinary.uploader.upload(dataURI, {
            folder: 'StayLiving',
            allowed_formats: ['png', 'jpg', 'jpeg'],
        }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
};

module.exports = {
    cloudinary,
    storage,
    uploadToCloudinary,
};