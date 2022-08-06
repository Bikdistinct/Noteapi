const dotenv = require("dotenv")
dotenv.config();
const mongoose=require("mongoose");

// const mongoURI="mongodb://localhost:27017/myNotebook";
const mongoURI="process.env.MONGOMY";
// mongoose.connect(process.env.MONGOMY,{useNewUrlParser:true});

const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("connected to mongodb successfully");
    });
}

module.exports=connectToMongo;