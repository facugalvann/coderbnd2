import { Router } from "express";
import passport from "passport";
import sessionController from "../controllers/sessions.controllers.js";
import authorization from '../config/authorization.js'
const  {login, register, Githublogin, viewLogin, viewRegister} = sessionController

const sessionsRouter = Router();

sessionsRouter.post('/register', passport.authenticate("register"), register);
sessionsRouter.post('/login', passport.authenticate("login"), login);
sessionsRouter.post('/github', passport.authenticate("github", {scope: ['user:email']}), (req,res) => {});
sessionsRouter.post('/githubcallback', passport.authenticate("github", {failureRedirect:'/api/sessoions/login'}), Githublogin);
sessionsRouter.get('/current', passport.authenticate("jwt"), authorization("Usuario") ,(req,res) => res.status(200).send(req.user));
sessionsRouter.get('/viewregister', viewRegister)
sessionsRouter.get('/viewlogin', viewLogin)
export default sessionsRouter
