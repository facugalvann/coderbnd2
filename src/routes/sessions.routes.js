import { Router } from "express";
import passport from "passport";
import { login, register } from "../controllers/sessions.controllers.js";

const sessionsRouter = Router();

sessionsRouter.post('/register', passport.authenticate("register"), register);
sessionsRouter.post('/login', passport.authenticate("login"), login);


sessionsRouter.get('/current', passport.authenticate("current", { session: false }), (req, res) => {
    if (req.user) {
        return res.status(200).send(req.user);  
    } else {
        return res.status(401).send({ message: "No autorizado" });
    }
});

export default sessionsRouter;
