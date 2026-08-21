const express=require("express");
const Match=require("../models/Match");
const Player=require("../models/Player");
const PlayerPerformance=require("../models/PlayerPerformance");
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

router.get("/:matchId/players",async(req,res)=>{
    try{
        const {matchId}=req.params;

        const performances=await PlayerPerformance.find({

        }).sort({playerName:1});

        res.json({
            matchId:matchId,
            count:performances.length,
            players:performances
        });
    }
    catch(error){
        console.error("GetMatch Players Error:",error.message);

        res.status(500).json({
            message:"Faile dto fetch match players"
        });
    }
});
router.get("/:matchId",async(req,res)=>{
    try{
        const {matchId}=req.params;

        const match=await Match.findOne({
            apiId:matchId
        });

        if(!match){
            return res.status(404).json({
                message:"Match not found"
            });
        }
        res.json(match);
    }
    catch(error){
        console.error("Get MatchError:",error.message);

        res.status(500).json({
            message:"Failed to fetch match"
        });
    }
});


router.get("/", async(req,res)=>{
    try{

        const { status,search } = req.query;

        let query = {};


        if(search){
            query.name={
                $regex:search,
                $options:"i"
            };
        }
        
        if(status==="live"){
            query={
                matchStarted:true,
                matchEnded:false
            };
        }
        else if(status==="completed"){
            query={
                matchEnded:true
            };
        }

        else if(status==="upcoming"){
            query={
                matchStarted:false,
                matchEnded:false
            };
        }

        console.log("STATUS:", status);
        console.log("QUERY:", query);
        const matches=await Match.find(query).sort({date:-1});

        res.json({
            count:matches.length,
            matches:matches
        });
    }
    catch(error){
        console.error("Get Matches Error:",error.message);

        res.status(500).json({
            message:"Failed to fetch matches"
        });
    }
});


router.get("/:matchId/scorecard", async (req, res) => {
    try {
        const { matchId } = req.params;

        console.log("SCORECARD SYNC:", matchId);

        const data = await getMatchScorecard(matchId);

        console.log("API DATA:",data);

        if(!data || !data.data){
            return res.status(500).json({
                message:"Scorecard API returned invalid data",
                data:data
            });
        }

        const scorecard=data.data.scorecard;

        for (const inning of scorecard) {

            // =========================
            // BATTING
            // =========================

            for (const batsman of inning.batting || []) {

                const player = batsman.batsman;

                if (!player) {
                    continue;
                }

                await Player.findOneAndUpdate(
                    {
                        apiId: player.id
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

                // Save match-specific batting performance
                await PlayerPerformance.findOneAndUpdate(
                    {
                        playerId: player.id,
                        matchId: matchId
                    },
                    {
                        playerId: player.id,
                        playerName: player.name,
                        matchId: matchId,

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
                        returnDocument: "after",
                        setDefaultsOnInsert: true
                    }
                );
                
            }


            // =========================
            // BOWLING
            // =========================

            for (const bowling of inning.bowling || []) {

                const player = bowling.bowler;

                if (!player) {
                    continue;
                }

                await Player.findOneAndUpdate(
                    {
                        apiId: player.id
                    },
                    {
                        apiId: player.id,
                        name: player.name,
                        cricbuzzId: player.cricbuzz_id,

                        bowling: {
                            overs: bowling.o || 0,
                            maidens: bowling.m || 0,
                            runs: bowling.r || 0,
                            wickets: bowling.w || 0,
                            noBalls: bowling.nb || 0,
                            wides: bowling.wd || 0,
                            economy: bowling.eco || 0
                        }
                    },
                    {
                        upsert: true,
                        returnDocument: "after"
                    }
                );

                await PlayerPerformance.findOneAndUpdate(
                            {
                                playerId: player.id,
                                matchId: matchId
                            },
                            {
                                playerId: player.id,
                                playerName: player.name,
                                matchId: matchId,

                                bowling: {
                                    overs: bowling.o || 0,
                                    maidens: bowling.m || 0,
                                    runs: bowling.r || 0,
                                    wickets: bowling.w || 0,
                                    noBalls: bowling.nb || 0,
                                    wides: bowling.wd || 0,
                                    economy: bowling.eco || 0
                                }
                            },
                            {
                                upsert: true,
                                returnDocument: "after",
                                setDefaultsOnInsert: true
                            } 
            );
}
            // =========================
            // FIELDING
            // =========================

            for (const fielding of inning.catching || []) {

                const player = fielding.catcher;

                if (!player) {
                    continue;
                }

                console.log("FIELDING PLAYER:", player.name);

                await Player.findOneAndUpdate(
                    {
                        apiId: player.id
                    },
                    {
                        $set: {
                            name: player.name,
                            cricbuzzId: player.cricbuzz_id
                        },

                        $inc: {
                            "fielding.catches": fielding.catch || 0,
                            "fielding.runouts": fielding.runout || 0,
                            "fielding.stumpings": fielding.stumped || 0
                        }
                    },
                    {
                        upsert: true,
                        returnDocument: "after",
                        setDefaultsOnInsert: true
                    }
                );


                await PlayerPerformance.findOneAndUpdate(
                    {
                        playerId: player.id,
                        matchId: matchId
                    },
                    {
                        playerId: player.id,
                        playerName: player.name,
                        matchId: matchId,

                        fielding: {
                            catches: fielding.catch || 0,
                            runouts: fielding.runout || 0,
                            stumpings: fielding.stumped || 0
                        }
                    },
                    {
                        upsert: true,
                        returnDocument: "after",
                        setDefaultsOnInsert: true
                    }
                 );
            }
        }


        // =========================
        // UPDATE MATCH
        // =========================

        const updatedMatch = await Match.findOneAndUpdate(
            {
                apiId: matchId
            },
            {
                scorecard: scorecard,
                matchStarted: data.data.matchStarted,
                matchEnded: data.data.matchEnded
            },
            {
                returnDocument: "after"
            }
        );

        if (!updatedMatch) {
            return res.status(404).json({
                message: "Match not found in database"
            });
        }

        res.json({
            message: "Scorecard synced successfully",
            matchId: matchId
        });

    }
    catch (error) {

        console.error(
            "Scorecard Sync Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Failed to fetch scorecard"
        });
    }
});



module.exports=router;