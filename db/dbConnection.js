const mongoose = require("mongoose");

const connectionDb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/myDataBase");
    //localhost:27017 sometime localhost not working instead use mongodb://127.0.0.1
    
    console.log("connected to mongodb");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectionDb;
