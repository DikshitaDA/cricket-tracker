const mongoose=require("mongoose");

const teamInfoSchema=new mongoose.Schema(
    {
        name:String,
        shortname:String,
        img:String
    },
    
    {
        _id:false
    }
);

const scoreSchema=new mongoose.Schema(
    {
        runs:Number,
        wickets:Number,
        overs:Number,
        inning:String
    },
    {
        _id:false
    }
);

const playerReferenceSchema = new mongoose.Schema(
    {
        id: String,
        name: String,
        cricbuzzId: String
    },
    {
        _id: false
    }
);
const battingSchema = new mongoose.Schema(
    {
        batsman: playerReferenceSchema,
        dismissal: String,
        dismissalText: String,
        bowler: playerReferenceSchema,
        catcher: playerReferenceSchema,
        runs: Number,
        balls: Number,
        fours: Number,
        sixes: Number,
        strikeRate: Number
    },
    {
        _id: false
    }
);

const bowlingSchema=new mongoose.Schema(
    {
       bowler: playerReferenceSchema,
        overs: Number,
        maidens: Number,
        runs: Number,
        wickets: Number,
        noBalls: Number,
        wides: Number,
        economy: Number 
    },
    {
        _id:false
    }
);

const catchingSchema=new mongoose.Schema(
    {
        catcher: playerReferenceSchema,
        stumped: Number,
        runout: Number,
        catch: Number,
        cb: Number,
        lbw: Number,
        bowled: Number
    },
    {
        _id:false
    }
);

const scorecardSchema=new mongoose.Schema(
    {
        batting: [battingSchema],
        bowling: [bowlingSchema],
        catching: [catchingSchema],
        extras: mongoose.Schema.Types.Mixed,
        totals: mongoose.Schema.Types.Mixed,
        inning: String
    },
    {
        _id:false
    }
);

const matchSchema=new mongoose.Schema(
    {
        apiId:{
            type:String,
            required:true,
            unique:true
        },

        name:{
            type:String,
            required:true
        },
        
        matchType: String,

        status: String,

        venue: String,

        date: String,

        dateTimeGMT: String,

        teams: [String],

        teamInfo: [teamInfoSchema],

        score: [scoreSchema],

        tossWinner: String,

        tossChoice: String,

        seriesId: String,

        scorecard: [scorecardSchema],

        matchStarted: Boolean,

        matchEnded: Boolean
    },
    {
        timestamps:true
    }
);

module.exports=mongoose.model("Match",matchSchema);