const mongoose=require("mongoose");

const playerSchema=new mongoose.Schema(
    {
        apiId:{
            type:String,
            required:true,
            unique:true
        },

        name: {
            type: String,
            required: true
        },

        cricbuzzId: {
            type: String
        },

        role: {
            type: String
        },

        batting: {
            matches: {
                type: Number,
                default: 0
            },
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
            matches: {
                type: Number,
                default: 0
            },
            overs: {
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
            economy: {
                type: Number,
                default: 0
            }
        }
    },
    {
        timestamps:true
    }
);

module.exports=mongoose.model(
    "Player",playerSchema
);
