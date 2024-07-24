const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {authenticateToken} = require("./userAuth");


//add book to favourite
router.put("/add-book-to-favourite", authenticateToken, async(req, res) => {
    try{
        const {bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);

        if(isBookFavourite){
            return res.status(200).json({message: "Book is already in favourites"});
        }

        await User.findByIdAndUpdate(id, {$push : {favourites : bookid} });
        return res.status(200).json({message: "Book added to favourites"});
    }
    catch(e){
        res.status(500).json({
            message:"Internal server error"
        })
    }
});

// delete book from favoutite
router.put("/remove-book-from-favourite", authenticateToken, async(req, res) => {
    try{
        const {bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);

        if(isBookFavourite){
            await User.findByIdAndUpdate(id, {$pull : {favourites : bookid} });
        }

      
        return res.status(200).json({message: "Book remove from favourites"});
    }
    catch(e){
        res.status(500).json({
            message:"Internal server error"
        })
    }
});

// get favourites books of a particular user
router.get("/get-favourite-books",  authenticateToken, async(req, res) => {
    try{
        const {id} = req.headers;
        const userData = await User.findById(id).populate("favourites");
        const favouriteBooks = userData.favourites;
        return res.json({
            status: "Success",
            data: favouriteBooks,
        })
    }
    catch(e){
        res.status(500).json({
            message:"Internal server error"
        })
    }

})


//get favourite 
module.exports = router;