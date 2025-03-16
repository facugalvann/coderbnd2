import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import cartModel from "./carts.models.js";

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
        unique: true,
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

userSchema.post("save", async function(userCreated) {
    try {
        const newCart = await cartModel.create({ products: [] });
        await userModel.findByIdAndUpdate(userCreated._id, {
            cart: newCart._id
        });
    } catch (e) {
        console.log("Error creando carrito para user:", e);
    }
});

userSchema.pre('save', async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const userModel = model("users", userSchema);

export default userModel;
