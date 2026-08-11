const express=require("express");
const cors=require("cors");
require("dotenv").config();


const connectDB=require("./config/db");
const {getCurrentMatches}=require("./services/cricketApi");

const app=express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.json({
        message: "Cricket Tracker API is running!"
    });
});

app.get("/api/test-matches",async(req,res)=>{
try{
    const data=await getCurrentMatches();
    res.json(data);
}
catch(error){
    res.status(500).json({
        message:"Failed to fetch cricket matches"
    });
}
});

connectDB();
const PORT=process.env.PORT||5000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});