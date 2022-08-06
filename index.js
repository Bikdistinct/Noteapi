// const connectToMongo=require("./db");
const dotenv = require("dotenv")
dotenv.config();
const express=require("express");
const cors = require("cors");
const mongoose=require("mongoose");
// connectToMongo();
const app=express();
// const port=5000;
app.use(cors());
app.use(express.json());
// app.get("/",(req,res)=>{
//     res.send("hello world");
// });

//mongoose.connect("mongodb+srv://admin-bikramjit:bik%40Skill%231@cluster0.qrapc.mongodb.net/Mynotebook",{useNewUrlParser:true});
mongoose.connect(process.env.MONGOMY,{useNewUrlParser:true});
// mongoose.connect("mongodb+srv://bikram:bikramMongo@cluster1.2bodz6h.mongodb.net/mynote",{useNewUrlParser:true});
//available Routes
app.use("/api/auth",require("./routes/auth"));
app.use("/api/note",require("./routes/notes"));






// app.listen(process.env.port,()=>{
//     console.log("connected to server");
// })

app.listen(process.env.PORT || 5000, function() {
    console.log("Server started on port 5000");
  });