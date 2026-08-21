const express=require("express");
const Player=require("../models/Player");

const router=express.Router();

router.get("/top-runs",async(req,res)=>{
    try{
        const players=await Player.find({
            "batting.runs":{$gt:0}
        })
        .sort({
            "batting-runs":-1
        })
        .limit(10);

        res.json({
            count:players.length,
            players:players
        });
    }
    catch(error){
        console.error("Top Runs Error:",error.message);

        res.status(500).json({
            message:"Failed to fetch top run scorers"
        });
    }
});


router.get("/top-wickets",async(req,res)=>{
    try{
        const players=await Player.find({
            "bowling-wickets":{$gt:0}
        })
        .sort({
            "bowling-wickets":-1
        })
        .limit(10);

        res.json({
            count:players.length,
            players:players
        });
    }
    catch(error){
        console.error("Top Wickets Error:",error.message);

        res.status(500).json({
            message:"Failed to fetch top wicket takers"
        });
    }
});

router.get("top-fielders",async(req,res)=>{
    try{
        const players=await Player.find({
            $or:[
                {"fielding.catches":{$gt:0}},
                {"fielding.runouts":{$gt:0}},
                {"fielding.stumpings":{$gt:0}}
            ]
        });

        players.sort((a,b)=>{
            const aTotal=
             a.fielding.catches+
             a.fielding.runouts+
             a.fielding.stumpings;

             const bTotal=
             b.fielding.catches+
             b.fielding.runouts+
             b.fielding.stumpings;
             return bTotal-aTotal;
        });

        res.json({
            count:players.length,
            players:players
        });
    }
    catch(error){
        console.error("Top Fielders Error:",error.message);

        res.status(500).json({
            message:"Failed to fetch top fielders"
        });
    }
});
module.exports=router;