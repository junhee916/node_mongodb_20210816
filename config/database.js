const mongoose = require('mongoose')

connectDB = async function(){

    try{
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex : true
        })

        console.log("connected mongodb...")
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectDB