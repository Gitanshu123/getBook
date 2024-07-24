const router = require("express").Router();
const {authenticateToken} = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");
const mongoose = require('mongoose');

// place order

router.post("/place-order", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;
        console.log("orderdata:", order);
        
        for (const orderData of order) {
            const newOrder = new Order({ user: id, book: orderData._id });
            const orderDataFromDb = await newOrder.save();

            console.log('New Order Saved:', orderDataFromDb);

            // Saving Order in user model
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { $push: { orders: orderDataFromDb._id } },
                { new: true } // Return the updated document
            );

            console.log('User after order push:', updatedUser);

            // Clearing cart
            const updatedUserAfterCartPull = await User.findByIdAndUpdate(
                id,
                { $pull: { cart: orderData._id } },
                { new: true } // Return the updated document
            );

            console.log('User after cart pull:', updatedUserAfterCartPull);
        }

        return res.json({
            status: "success",
            message: "Order placed successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred",
        });
    }
});


//get order history of particular user

router.get("/get-order-history", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        // console.log('User ID:', id); // Log the ID to make sure it's correct

        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" },
        });

        if (!userData) {
            return res.status(404).json({
                status: "Failure",
                message: "User not found",
            });
        }

        console.log('User Data:', userData); // Log user data to see what is retrieved
        const ordersData = userData.orders.reverse();
        console.log('Orders Data:', ordersData); // Log orders data to check if it contains orders

        return res.json({
            status: "Success",
            data: ordersData,
        });
    } catch (error) {
        console.error('Error retrieving order history:', error); // More detailed error logging
        return res.status(500).json({
            message: "An error occurred",
        });
    }
});

 

// get-all-orders -->admin
router.get("/get-all-orders", authenticateToken, async(req, res) => {
    try {
        const userData = await Order.find()
        .populate({
            path:"book",
        })
        .populate({
            path: "user",
        })
        .sort({createdAt: -1});

        return res.json({
            status: "Success",
            data: userData,
        });
    } catch (error) {
       console.log(error);
       return res.status(500).json({
        message: "An error occured"
       });
    }
});


//update order -->admin
// router.put("/update-status/:id", authenticateToken, async(req,res) => {
//     try {
//         const {id} = req.params;

        
//         await Order.findByIdAndUpdate(id, {status: req.body.status});
//         return res.json({
//             status: "success",
//             message: "Status updated successfully",
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "An error occured"
//         });
//     }
// })

router.put("/update-status/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid order ID",
            });
        }

        // Log the id for debugging purposes
        console.log(`Updating status for order ID: ${id}`);

        // Perform the update
        const updatedOrder = await Order.findByIdAndUpdate(id, { status: req.body.status }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        return res.json({
            status: "success",
            message: "Status updated successfully",
            order: updatedOrder,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred",
        });
    }
});

module.exports = router;
 