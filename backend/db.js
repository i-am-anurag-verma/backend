const mongoose = require('mongoose');


    const url = "mongodb+srv://newproject:kMZAXmML46Q0Eokq@cluster0.uj55feu.mongodb.net/inotebook?retryWrites=true&w=majority";
//    mongoURI = "mongodb://localhost:27017/?directConnection=true"

    const connectToMongo = () => {
        mongoose.connect(url, ()=>{ 
            console.log("connected to mongo successfully")
        })
}


module.exports  = connectToMongo;



