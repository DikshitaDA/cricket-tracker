const mongoose=require("mongoose");

const playerPerformanceSchema=new mongoose.Schema(
    {
        playerId: {
            type: String,
            required: true
        },

        playerName: {
            type: String,
            required: true
        },

        matchId: {
            type: String,
            required: true
        },

        batting: {
            runs: {
                type: Number,
                default: 0
            },
            balls: {
                type: Number,
                default: 0
            },
            fours: {
                type: Number,
                default: 0
            },
            sixes: {
                type: Number,
                default: 0
            },
            strikeRate: {
                type: Number,
                default: 0
            }
        },

        bowling: {
            overs: {
                type: Number,
                default: 0
            },
            maidens: {
                type: Number,
                default: 0
            },
            runs: {
                type: Number,
                default: 0
            },
            wickets: {
                type: Number,
                default: 0
            },
            noBalls: {
                type: Number,
                default: 0
            },
            wides: {
                type: Number,
                default: 0
            },
            economy: {
                type: Number,
                default: 0
            }
        },

        fielding: {
            catches: {
                type: Number,
                default: 0
            },
            runouts: {
                type: Number,
                default: 0
            },
            stumpings: {
                type: Number,
                default: 0
            }
        }
    },
    {
        timestamps: true
    }
);

playerPerformanceSchema.index(
    {
        playerId:1,
        matchId:1
    },
    {
        unique:1
    }
);


module.exports=mongoose.model(
    "PlayerPerformance",
    playerPerformanceSchema
);