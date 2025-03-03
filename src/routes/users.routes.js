 import { Router } from "express";
  import { getUsers, getUSer,  } from "../controllers/users.controllers.js"

 const usersRouter = Router()
 usersRouter.get('/', getUsers)
 usersRouter.get('/:uid', getUSer)
 


 export default usersRouter
