import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "Carts"
    },
    role: {
        type: String,
        default: "user"
    }
});


userSchema.pre('save', function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, 5); 
    }
    next();
});


userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

const userModel = model("users", userSchema);

export default userModel;
