const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth");

//Sign Up
router.post("/sign-up", async (req, res) => {
    try {
       const {username, email, password, address} = req.body;

       //check username
       if(username.length < 4){
        return res.status(400).json({
            message:"Username length should be more than 3"
        });
       }

       //check username already exists?

       const existingUsername = await User.findOne({username: username});

       if(existingUsername) {
        return res.status(400).json({
            message:"Username already exists"
        });
       }

       // check email
       const existingEmail = await User.findOne({email: email});
       if(existingEmail) {
        return res.status(400).json({
            message:"Email already exists"
        });
       }

       //check password

       if(password.length <= 5){
        return res.status(400).json({
            message:"password length should be more than 5"
        });
       }

    const hashPass =  await bcrypt.hash(password, 10);

      const newUser = new User({
        username: username,
        email: email,
        password: hashPass,
        address: address,
      });

      await newUser.save();
      return res.status(200).json({
        message:"User Created Successfully"
      })

    }
    catch(e){
        res.status(500).json({
            message:"Internal Server error"
        });
    }
})


//login
router.post("/sign-in", async(req, res)=>{
    try{
        const {username, password} = req.body;

        const existingUser = await User.findOne({username});
        if(!existingUser){
            res.status(400).json({message: "Invalid Credentials"});
        }

        await bcrypt.compare(password, existingUser.password, (err, data) => {
            if(data){
                const authClaims = [
                    {name: existingUser.username},
                    {role: existingUser.role},
                ];
               const token = jwt.sign({authClaims}, "getBook123", {
                expiresIn : "30d",
               });

               res.status(200).json({
                id: existingUser._id, 
                role: existingUser.role, 
                token:token,
                message:"Login Sucessfully",
            });

              
            }
            else{
                res.status(400).json({message:"Invalid Crendentials"});
            }
        });
    }
    catch(e){
            res.status(500).json({
                message:"Internal Server error"
            });
        }
    }
)

//get user information
router.get("/get-user-information", authenticateToken,  async (req, res) => {
    try{
      const {id} = req.headers;
      const data = await User.findById(id).select('-password');
      return res.status(200).json(data);
    }
    catch(e) {
        res.status(500).json({
            message:"Internal Server error"
        });
    }
})

//update address
router.put("/update-address", authenticateToken, async(req,res) => {
    try{
         const {id} = req.headers;
         const {address} = req.body;
         await User.findByIdAndUpdate(id, {address: address});
         return res.status(200).json({message : "Address updated successfully"});
    }
    catch(e){
        res.status(500).json({
            message:"Internal Server error"
        });
    }
})



module.exports = router;

