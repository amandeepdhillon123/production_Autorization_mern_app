
const mongoose =require("mongoose");
require("dotenv").config()

const dbConnect = ()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })

    .then(()=> console.log("db connection successful"))
    .catch((error)=>{
          console.log("dbconnection failed ");
          console.error(error)
          process.exit(1)
    })
}

module.exports =dbConnect

