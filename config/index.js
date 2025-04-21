require('dotenv').config();
const MONGO_URI = process.env.MONG0_URI;
const PORT = process.env.PORT || 8080;

module.exports ={
    MONGO_URI,
    PORT
}