import 'dotenv/config'
import jwt from 'passport-jwt'
import passport from 'passport'
import local from 'passport-local'
import GithubStrategy from 'passport-github2'
import { validatePassword, hashPassword } from '../utils/bcrypt.js'
import userModel from '../models/users.models.js'

const localStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const cookieExtractor = (req) => {
    let token = null
    if (req.cookies) {
        token = req.cookies['coderSession']
    }
    return token
}

const initializatedPassword = () => {

    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        try {
            const { first_name, last_name, email, password, age } = req.body

            const existingUser = await userModel.findOne({ email })
            if (existingUser) {
                return done(null, false, { message: 'Usuario ya existe' })
            }

            const newUser = await userModel.create({
                first_name,
                last_name,
                email,
                password: hashPassword(password),
                age
            })

            return done(null, newUser)
        } catch (e) {
            return done(e)
        }
    }))


    passport.use('login', new localStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })

            if (!user || !validatePassword(password, user.password)) {
                return done(null, false, { message: 'Credenciales incorrectas' })
            }

            return done(null, user)
        } catch (e) {
            return done(e)
        }
    }))


    passport.use('github', new GithubStrategy({
        clientID: "Ov23lieEc9tYchaaTmkT",
        clientSecret: "004c4f9c5bfed4a480ee0da6f07c2933d049e568",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accesToken, refreshToken, profile, done) => {
        try {
            let user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                user = await userModel.create({
                    first_name: profile._json.name,
                    last_name: "",
                    email: profile._json.email,
                    password: hashPassword("coder"),
                    age: 18
                })
            }
            done(null, user)
        } catch (e) {
            done(e)
        }
    }))


    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => {

        try {
            return done(null, jwt_payload)
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

export default initializatedPassword;
