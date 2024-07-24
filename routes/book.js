const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth");
const Book = require("../models/book");


// add book
router.post("/add-book", authenticateToken, async(req, res) => {
    try{
        const {id} = req.headers;

         const user = await User.findById(id);

         if(user.role !== "admin"){
            return res.status(400).json({
                message:"You don't have access to add the book"
            })
         }
        const book = new Book({
            url : req.body.url,
            title : req.body.title,
            author : req.body.author,
            price : req.body.price,
            desc : req.body.desc,
            language : req.body.language,
        });
        await book.save();

        res.status(200).json({
            message: "Book added successfully"
        })
    }
    catch(e){
        res.status(500).json({
            message:"Internal server error"
        })
    }
})

//update book
// router.put("/update-book", authenticateToken, async(req, res) => {
//     try{
//         const {bookid} = req.headers;

//       await Book.findByIdAndUpdate(bookid,{

//             url : req.body.url,
//             title : req.body.title,
//             author : req.body.author,
//             price : req.body.price,
//             desc : req.body.desc,
//             language : req.body.language,
//       });

//         res.status(200).json({
//             message: "Book Updated successfully"
//         })
//     }
//     catch(e){
//         res.status(500).json({
//             message:"Internal server error"
//         })
//     }
// })

router.put("/update-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;

        if (!bookid) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        const updatedBook = await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        }, { new: true });

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({
            message: "Book updated successfully",
            data: updatedBook,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// delete book
router.delete("/delete-book", authenticateToken, async(req, res) => {
    try{
     const {bookid} = req.headers;
     await Book.findByIdAndDelete(bookid);
     return res.status(200).json({
        message: "Book deleted successfully!",
     });
    }
    catch(e){
      console.log(e);
      return res.status(500).json({
        message: "An error occured"
      });
    }
})

//get all books
router.get("/get-all-books", async(req, res) => {
    try{
       const books = await Book.find().sort({createAt: -1});
       return res.json({
         status:"success",
         data: books,
       });
       
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
          message: "An error occured"
        });    
    }
})

// get recent books
router.get("/get-recent-books", async(req, res) => {
    try{
       const books = await Book.find().sort({createAt: -1}).limit(4);
       return res.json({
         status:"success",
         data: books,
       });
       
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
          message: "An error occured"
        });    
    }
})

// book details
router.get("/get-book-by-id/:id", async (req, res) => {
    try{
        const {id} = req.params;
        const book = await Book.findById(id);
        return res.json({
            status:"Success",
            data: book,
        })
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
          message: "An error occured"
        });  
    }

})
module.exports = router;