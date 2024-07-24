// const mongoose = require("mongoose");

// const conn = async () =>{
//     try{
//        await mongoose.connect(`${process.env.URI}`);
//        console.log("Connected to Database");
//     }
//     catch(error){
//     console.log(error);
//     }
// };

// conn();

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const conn = async () => {
    try {
        await mongoose.connect(process.env.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = conn;