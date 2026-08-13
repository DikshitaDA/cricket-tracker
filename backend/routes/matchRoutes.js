const express=require("express");
const Match=require("../models/Match");
const {getCurrentMatches}=require("../services/cricketApi");

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

module.exports=router;