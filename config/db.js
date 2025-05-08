const mongoose = require("mongoose")


async function connectDB(){
    try{
        await mongoose.connect(env('MONGODB_URI',))
    }catch(err){
        console.log(err)
    }
}

module.exports = connectDB