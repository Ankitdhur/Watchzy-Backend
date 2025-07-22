const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const wishlistItemSchema = new mongoose.Schema({
    poster_path: { type: String, required: true },
    name: { type: String, required: true },
    id: { type: String, required: true }
});
/*******************userModel*********************/
// user create -> Jio cinema  -> set of rules
const schemaRules = {
    name: {
        type: String,
        required: [true, "name is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email should be unique"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: [6, "password should be atleast of 6 length"],
    },
    confirmPassword: {
        type: String,
        required: true,
        minLength: 6,
        // custom validation
        validate: [function () {
            return this.password == this.confirmPassword;
        }, "password should be equal to confirm password"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,

        default: "user"
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    wishlist: [wishlistItemSchema],
}

const userSchema = new mongoose.Schema(schemaRules);

/******hooks in mongodb********/

const validRoles = ["user", "admin", "feed curator", "moderator"];

userSchema.pre("save", async function (next) {
    // 1. Confirm Password should not be saved
    this.confirmPassword = undefined;

    //  2. Validate Role
    if (!validRoles.includes(this.role)) {
        return next("Role is not allowed");
    }

    // 3. Hash Password if Modified
    if (this.isModified("password")) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

userSchema.post("save", function () {
    console.log("post save was called");
    this.__v = undefined;
    this.password = undefined;
})
// final touch point
const UserModel = mongoose.model("User", userSchema);
// default export
module.exports = UserModel;

