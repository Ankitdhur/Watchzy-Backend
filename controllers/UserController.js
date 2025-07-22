const UserModel = require("../Model/UserModel");

const getCurrentUser = async (req, res) => {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            status: "failure",
        });
    }

    res.status(200).json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            wishlist: user.wishlist,
            isPremium: user.isPremium,
        },
        status: "success",
    })
}
const getUserWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await UserModel.findById(userId);
        res.status(200).json({
            data: user.wishlist,
            status: "success",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
            status: "failure",
        });
    }
};


const addToWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const { id, poster_path, name, media_type } = req.body;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        if (user.wishlist.find(item => item.id === id)) {
            return res.status(400).json({
                message: "Item already in wishlist",
                status: "failure",
            });
        }


        const wishlistItem = {
            poster_path: poster_path,
            name: name,
            id: id,
            media_type: media_type,
        };

        user.wishlist.push(wishlistItem);
        await UserModel.findOneAndUpdate(
            { _id: userId },
            { $push: { wishlist: wishlistItem } },
            { new: true, upsert: true } // options to return the updated document and create if it doesn't exist
        );

        res.status(200).json({
            status: "success",
        });
    } catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: error.message,
            status: "failure",
        });
    }
};
module.exports = { getCurrentUser, getUserWishlist, addToWishlist };