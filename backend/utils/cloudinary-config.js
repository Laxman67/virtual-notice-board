const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure CORS headers for Cloudinary
const configureCloudinaryCORS = () => {
  // Add your frontend domain to allowed origins
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',

  ];

  return allowedOrigins;
};

module.exports = {
  cloudinary,
  configureCloudinaryCORS
};
