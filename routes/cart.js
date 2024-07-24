const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

// Put book to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);

        // Log userData to check its structure
        console.log("User Data:", userData);

        const isBookinCart = userData.cart.includes(bookid);
        if (isBookinCart) {
            return res.json({
                status: "Success",
                message: "Book is already in cart",
            });
        }

        await User.findByIdAndUpdate(id, {
            $push: { cart: bookid },
        });

        return res.json({
            status: "Success",
            message: "Book added to cart",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

//remove from cart
router.put("/remove-from-cart", authenticateToken, async (req, res) => {
    // try {
    //     const { bookid } = req.params;
    //     const {id} = req.headers;
   
    //     await User.findByIdAndUpdate(id, {
    //         $pull: { cart: bookid },
    //     });

    //     return res.json({
    //         status: "Success",
    //         message: "Book removed from cart",
    //     });
    // } 

    try{
    const { bookid } = req.body;
    const { id } = req.headers;

    await User.findByIdAndUpdate(id, {
        $pull: { cart: bookid },
    });

    return res.json({
        status: "Success",
        message: "Book removed from cart",
    });
}
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

//get cart of particular user
router.get("/get-user-cart", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("cart");
         const cart = userData.cart.reverse();


            return res.json({
                status: "Success",
                data: cart,
                message: "Cart fetched successfully",
            });
        }

    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});


module.exports = router;