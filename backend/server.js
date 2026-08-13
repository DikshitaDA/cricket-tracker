const express=require("express");
const cors=require("cors");
require("dotenv").config();

console.log("API key loaded:", !!process.env.CRICKET_API_KEY);

const connectDB=require("./config/db");
const matchRoutes=require("./routes/matchRoutes");
const {
    getCurrentMatches,
    getMatchScorecard
}=require("./services/cricketApi");

const app=express();

app.use(cors());
app.use(express.json());
app.use("/api/matches",matchRoutes);

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


app.get("/api/test-scorecard/:matchId", async(req,res)=>{
    try {
        const data=await getMatchScorecard(req.params.matchId);
        res.json(data);
    }
    catch(error){
        res.status(500).json({
            message:"Failed to fetch match scorecard"
        });
    }
});
connectDB();
const PORT=process.env.PORT||5000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});