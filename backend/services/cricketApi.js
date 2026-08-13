const axios=require("axios");

const getCurrentMatches=async()=>{
    try{
        const response=await axios.get(
             "https://api.cricapi.com/v1/currentMatches",
             {
                params:{
                    apikey: process.env.CRICKET_API_KEY,
                    offset:0
                }
             }
        );
        return response.data;
    }
    catch(error){
        console.error("Cricket API Error:",
            error.response?.data||error.message
        );
        throw error;
    }
};

const getMatchScorecard=async (matchId)=>{
    try{
        const response=await axios.get(
            "https://api.cricapi.com/v1/match_scorecard",
            {
                params:{
                    apikey:process.env.CRICKET_API_KEY,
                    offset:0,
                    id:matchId
                }
            }
        );
        return response.data;
    }
    catch(error){
        console.error(
            "Scorecard API Error:",
            error.response?.data||error.message
        );
        throw error;
    }
};

module.exports={
    getCurrentMatches,
    getMatchScorecard
};