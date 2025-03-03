import express from "express"
import cookieParser from "cookie-parser"
import session from "express-session"
import MongoStore from "connect-mongo"
import mongoose from "mongoose"
import usersRouter from './routes/users.routes.js'
import sessionsRouter from "./routes/sessions.routes.js"
import cartsRouter from "./routes/carts.routes.js"
import passport from 'passport'
import initializatedPassword from './config/passport.js'


const app = express()
const PORT = 8080



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


app.use('/api/users', usersRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/carts', cartsRouter)

app.listen(PORT,() => {
    console.log("Server on port:", PORT)
})
