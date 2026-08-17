const express=require("express");
const Player=require("../models/Player");
const PlayerPerformance = require("../models/PlayerPerformance");

const router=express.Router();
console.log("PLAYER ROUTES LOADED");

router.get("/",async(req,res)=>{
    try{

        const {search}=req.query;

        const page=parseInt(req.query.page)||1;
        const limit=parseInt(req.query.limit)||10;

        const skip=(page-1)*limit;


        let query={};

        if(search){
            query={
                name:{
                    $regex:search,
                    $options:"i"
                }
            };
        }

        const totalPlayers=await Player.countDocuments(query);
        const players=await Player.find(query).sort(
            {
                name:1
            }).skip(skip).limit(limit);
            
        res.json({
            page: page,
            limit: limit,
            totalPlayers: totalPlayers,
            totalPages: Math.ceil(totalPlayers / limit),
            count:players.length,
            players:players
        });  
    }

    catch(error){
        console.error("Get Players Error:",error.message);

        res.status(500).json({
            message:"Failed to fetch players"
        });
    }
});

router.get("/stats/top-batsmen", async (req, res) => {
    try {
        console.log("TOP BATSMEN ROUTE HIT");

        const players = await Player.find()
            .sort({ "batting.runs": -1 })
            .limit(10);

        console.log("TOP BATSMEN FOUND:", players.length);

        res.json({
            count: players.length,
            topBatsmen: players
        });
    }
    catch (error) {
        console.error("Top Batsmen Error:", error.message);

        res.status(500).json({
            message: "Failed to fetch top batsmen"
        });
    }
});

router.get("/stats/top-bowlers",async(req,res)=>{
    try{
        console.log("TOP BOWLERS ROUTE HIT");
        const players=await Player.find().sort({"bowling.wickets":-1})
        .limit(10);
        console.log("TOP BOWLERS FOUND:",players.length);

        res.json({
            count:players.length,
            topBowlers:players
        });
    }
    catch(error){
        console.error("Top Bowlers Error:",players.length);

        res.status(500).json({
            message:"Failed to fetch top bowlers"
        });
    }
});


router.get("/stats/top-fielders",async(req,res)=>{
    try{
        console.log("TOP FIELDERS ROUTE HIT");

        const players=await Player.find()
        .sort({
            "fielding-catches":-1,
            "fielding.runouts":-1,
            "fielding.stumpings":-1
        }).limit(10);

        console.log("TOP FIELDERS FOUND:",players.length);

        res.json({
            count:players.length,
            topFielders:players
        });
    }
    catch(error){
        console.log("Top Fielders Error:",error.message);

        res.status(500).json({
            message:"Failed to fetch fielders"
        });
    }
});
router.get("/:playerId/performances",async(req,res)=>{
    console.log("PERFORMANCE ROUTE HIT");

    try{
        const {playerId}=req.params;

        const performances=await PlayerPerformance.find({
            playerId:playerId
        }).sort({createdAt:-1});

        res.json({
            playerId:playerId,
            count:performances.length,
            performances:performances
        });
    }

    catch(error){
        console.error("Get Player Performances Error:",error.message);

        res.status(500).json({
            message:"Failed to fetch player performances"
        });
    }
});


router.get("/:playerId",async(req,res)=>{
    try{
        const {playerId}=req.params;

        const player=await Player.findOne({
            apiId:playerId
        });

        if(!player){
            return res.status(404).json({
                message:"Player not found"
            });
        }
        res.json(player);
    }

    catch(error){
        console.error("Get Player Error:",error.message);

        res.status(500).json({
            message:"Failed to fetch player"
        });
    }
});

module.exports=router;