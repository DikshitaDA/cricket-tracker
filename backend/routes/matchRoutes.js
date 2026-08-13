const express=require("express");
const Match=require("../models/Match");
const Player=require("../models/Player");
const {getCurrentMatches,
       getMatchScorecard
}=require("../services/cricketApi");

const router=express.Router();

router.get("/sync",async(req,res)=>{
    try{
        console.log("SYNC ROUTE HIT");
        const data=await getCurrentMatches();

        const matches=data.data;

        for(const match of matches){
            await Match.findOneAndUpdate(
                {
                    apiId:match.id
                },

                {
                    apiId: match.id,
                    name: match.name,
                    matchType: match.matchType,
                    status: match.status,
                    venue: match.venue,
                    date: match.date,
                    dateTimeGMT: match.dateTimeGMT,
                    teams: match.teams,
                    teamInfo: match.teamInfo,
                    score: match.score,
                    tossWinner: match.tossWinner,
                    tossChoice: match.tossChoice,
                    seriesId: match.series_id,
                    matchStarted: match.matchStarted,
                    matchEnded: match.matchEnded
                },
                {
                    upsert:true,
                    returnDocument: "after"
                }
            );
        }

        console.log("ALL MATCHES SAVED");
        res.json({
            message:"Matches synced successfully",
            count:matches.length
        });
    }
    catch(error){
        console.error("Sync Error:",error.message);

        res.status(500).json({
            message:"Failed to sync matches"
        });
    }
});


router.get("/:matchId/scorecard",async(req,res)=>{
    try{
        const {matchId}=req.params;
        console.log("SCORECARD SYNC:",matchId);
        const data=await getMatchScorecard(matchId);

        const scorecard=data.data.scorecard;


        for (const inning of scorecard){
            for(const batsman of inning.batting || []){
                const player=batsman.batsman;

                if(!player){
                    continue;
               }

               await Player.findOneAndUpdate(
                {
                    apiId:player.id
                },
                
                 {
                        apiId: player.id,
                        name: player.name,
                        cricbuzzId: player.cricbuzz_id,

                        batting: {
                            runs: batsman.r || 0,
                            balls: batsman.b || 0,
                            fours: batsman["4s"] || 0,
                            sixes: batsman["6s"] || 0,
                            strikeRate: batsman.sr || 0
                        }
                    },
                    {
                        upsert: true,
                        returnDocument: "after"
                    }
               );
            }
        }
        const updatedMatch=await Match.findOneAndUpdate(
            {
                apiId:matchId
            },
            {
                scorecard:scorecard,
                matchStarted: data.data.matchStarted,
                matchEnded:data.data.matchEnded
            },
            {
                returnDocument:"after"
            }
        );

        if(!updatedMatch){
            return res.status(404).json({
                message:"Match not found in database"
            });
        }

        res.json({
            message:"Scorecard synced successfully",
            matchId: matchId
        });
    }
    catch(error){
        console.error(
            "Scorecard Sync Error:",
            error.response?.data||error.message
        );

        res.status(500).json({
            message:"Failed to fetch scorecard"
        });
    }
});
module.exports=router;