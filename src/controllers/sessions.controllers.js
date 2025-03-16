import jwt from "jsonwebtoken";
import { generateToken } from '../utils/jwt.js'
import userModel from "../models/users.models.js";


export const login = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({message: "Usuario o contraseña no válidos"});
        }


        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name,
            rol: req.user.rol
        }

        return res.status(200).cookie('coderSession', generateToken(req.user), {
            httpOnly: true,
            Secure: false,
            maxAge: 86400000
        }).json({message: "Usuario logueado correctamente"});
    } catch (e) {
        res.status(500).json({message: e});
    }
};


export const register = async (req, res) => {
    try {
        if (!req.user)
            return res.status(400).json({message: "Email y contrase;a son obligatorios"})

        return res.status(201).json({message: "Usuario registrado correctamente"})
    } catch (e) {
        res.status(500).json({message: e})
    }
}

const Githublogin = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send("Error al autenticar con GitHub");
        }


        const token = generateToken(req.user);


        return res.status(200)
            .cookie('coderSession', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',  // Usar 'true' solo en producción
                maxAge: 86400000
            })
            .send("Usuario autenticado con GitHub correctamente");
    } catch (e) {
        res.status(500).send(e);
    }
};

const viewRegister = async (req, res) => {
    res.status(200).render('templates/register', {
        title: "Registro de Usuarios",
        url_js: "/js/register.js",
        url_css: "/css/main.css"
    })
}

const viewLogin = async (req,res) => {
    res.status(200).render('templates/login', {
        title: "Inicio de Sesion de Usuarios",
        url_js: "/js/login.js",
        url_css: "/css/main.css"
    })
}


export default {
    login,
    register,
    Githublogin,
    viewRegister,
    viewLogin
};

