import express from "express"
import cookieParser from "cookie-parser"
import session from "express-session"
import MongoStore from "connect-mongo"
import mongoose from "mongoose"
import path from 'path'
import passport from 'passport'
import { create } from 'express-handlebars'
import initializatedPassword from './config/passport.js'
import indexRouter from "./routes/index.routes.js"
import __dirname from './path.js'
import config from "../config.js"
import dotenv from 'dotenv';
import { Command } from "commander"

const app = express();
const hbs = create();
const program = new Command();


program
    .option("-d", "Variable de debug", false)
    .option('-p <port>', "Puerto de mi aplicación", 8080)
    .option('--mode <mode>', "Entorno de ejecución de la aplicación", "development")
    .requiredOption('-u <users>', "Usuario de mi app", "No se ingresó ningún usuario");
program.parse();

const opts = program.opts();


dotenv.config({
    path: opts?.mode === "development" ? './.env.development' : './.env.production'
});

const { URL_MONGO, USER, PASS_MONGO, SECRET_SESSION, SECRET_COOKIE } = process.env;
const PORT = opts.p || 8080; 



app.use(express.json())
app.use(cookieParser("firmaSecreta"))
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://galvanfacundo004:Facugoten05@codercluster.dx1rh.mongodb.net/?retryWrites=true&w=majority&appName=CoderCluster",
        ttl: 60
    }),
    secret: "sesionSecreta",
    resave: true,
    saveUninitialized: true
}))

mongoose.connect('mongodb+srv://galvanfacundo004:Facugoten05@codercluster.dx1rh.mongodb.net/c82641?retryWrites=true&w=majority&appName=CoderCluster')
    .then(() => console.log("DB is connected"))
    .catch((e) => console.log("Server on port:", PORT))


initializatedPassword()
app.use(passport.initialize())
app.use(passport.session())
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

app.use('/', indexRouter)

app.listen(PORT, () => {
    console.log("Server on port:", PORT)
})
