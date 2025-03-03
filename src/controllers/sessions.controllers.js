import jwt from "jsonwebtoken"; 
import userModel from "../models/users.models.js"; 


export const login = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send("Usuario o contraseña no válidos");
        }

        
        const token = jwt.sign(
            { id: req.user._id, email: req.user.email },
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        
        res.cookie("token", token, {
            httpOnly: true,  
            secure: process.env.NODE_ENV === "production", 
            maxAge: 3600000, 
        });

        res.status(200).send("Usuario logueado correctamente");
    } catch (e) {
        res.status(500).send(e);
    }
};


export const register = async (req, res) => {
    try {
        if(!req.user)
            return res.status(400).send("Email y contrase;a son obligatorios")
        
        return res.status(201).send("Usuario registrado correctamente")
    } catch (e) {
        res.status(500).send(e)
    }
}