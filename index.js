const express = require("express");
const mongoose = require("mongoose");
const userModel =require("./models/User")
const reviewModel = require("./models/Review")
const axios = require("axios");
const bcrypt= require("bcryptjs")
const cors = require("cors");
const app = express();
const connectionDb = require("./db/dbConnection")
app.use(express.json());
app.use(cors())
connectionDb();

const BASE_URL = "https://api.openbrewerydb.org/breweries";

//signup
app.post("/signup",async(req,res)=>{
    const {username,email,password} = req.body;
    // console.log(req.body)
    

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // const newUser = new userModel(req.body);
        const newUser = new userModel({
          username,
          email,
          password: hashedPassword,
        });
        await newUser.save();
        res.status(200).json({ message: "User registered successfully" });

    }
    catch(error){
         res.status(500).json({ error: "Error registering user" });

    }

})

//login

app.post("/login" , async(req,res)=>{
    const {email,password}=req.body;
    try{
        // user validate
        const validUser = await userModel.findOne({email})
       
        if(!validUser){
            return res.status(400).json({ error: "User not found!"})
        }

        //passWord validate
        const validPassword = await bcrypt.compare(password , validUser.password);
        if(!validPassword){
            return res.status(400).json({error:"Invalid Credentails!"})
        }
      res.status(200).json({ message: "Successfully logged in!", userId: validUser._id });

    }
    catch(error){
        res.status(500).json({ error: "Error logging in" });
    }
})


//search breweries

app.get("/search", async (req, res) => {
  const { by_city, by_name, by_type } = req.query;
//   console.log( req.query);

  // Build query parameters
  const params = {};
  if (by_city) params.by_city = by_city;
  if (by_name) params.by_name = by_name;
  if (by_type) params.by_type = by_type;

  try {
    const response = await axios.get(BASE_URL, { params });
    // console.log(response.data);
    res.json(response.data);
  } catch (error) {
    // console.error( error);
    res.status(500).json({ error: "Error fetching breweries" });
  }
});


// Get Brewery Details 
app.get("/breweries/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(req.params); //{ id: '34e8c68b-6146-453f-a4b9-1f6cd99a5ada' }
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
   const reviews = await reviewModel.find({ breweryId: id });
  //  console.log( response.data); 
  //  console.log("Reviews fetched:", reviews); 
   res.json({ brewery: response.data, reviews });
    // res.json(response.data);
  } catch (error) {
    // console.error( error);
    res.status(500).json({ error: "Error fetching brewery details" });
  }
});

app.post("/breweries/:id/review", async (req, res) => {
  const { id } = req.params;
  const { rating, description, userId } = req.body;
  try {
    const newReview = new reviewModel({
      breweryId: id,
      rating,
      description,
      userId,
    });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: "Error adding review" });
  }
});


app.listen(3001,()=>{
    console.log("Server is running at port 3001")
})