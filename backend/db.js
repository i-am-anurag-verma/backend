const mongoose = require('mongoose');


    const url = "mongodb+srv://newproject:w797fmG1FrvLuEIH@cluster0.uj55feu.mongodb.net/inotebook?retryWrites=true&w=majority";
//    mongoURI = "mongodb://localhost:27017/?directConnection=true"

const getConnection = async () => {
    try {
      const conn = await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      if (conn) {
        console.log(`Connected to MongoDB on ${conn.connection.host}`);
      } else {
        console.log("Failed to connect DB");
      }
    } catch (error) {
      console.log(`Failed with error: ${error.message}`);
    }

}
  


module.exports  = getConnection;



