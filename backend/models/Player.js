const mongoose=require("mongoose");

const playerSchema=new mongoose.Schema(
    {
        apiId:{
            type:String,
            required:true,
            unique:true
        },

        cricapiId:{
            type:String
        },

        name:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
);

module.exports=mongoose.model(
    "Player",playerSchema
);
