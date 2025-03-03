import jwt from 'jsonwebtoken';
import passport from 'passport'
import local from 'passport-local'
import { validatePassword, hashPassword } from '../utils/bcrypt.js'
import userModel from '../models/users.models.js'

const localStrategy = local.Strategy

const initializatedPassword = () => {
    passport.use('register', new localStrategy({
        passReqToCallBack: true,
        usernameField:'email'
    }, async (req, username, password, done) => {
        try {
            const {first_name, last_name, email, password, age} = req.body
            const newUser = await userModel.create({ 
                first_name: first_name, 
                last_name: last_name, 
                email: email, 
                password: hashPassword(password), 
                age: age 
            })
            return done(null, newUser)
            res.status(201).send(`Usuario registrado correctamente`)
        } catch (e) {
            return done(e)
        }
    }))
    
    passport.use('login', new localStrategy({usernameField: 'email'}, async (username, password, done) => {
        try {
    
            const user = await userModel.findOne({ email:username })
    
            if (validatePassword(password, user?.password)) {
                return done(null, user)
            } else {
                return (null, false)
            }
    
        } catch (e) {
            return done(e)
        }
    }))


    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })

}

passport.use("current", async (req, done) => {
    const token = req.cookies.token;

    if (!token) {
        return done(null, false, { message: "No hay token, acceso denegado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
        }

        return done(null, user);
    } catch (e) {
        return done(e);
    }
});



export default initializatedPassword