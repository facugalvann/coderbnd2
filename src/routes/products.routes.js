import {Router} from "express";
import {getProducts, getProduct, createProduct, updateProduct, deleteProduct} from "../controllers/products.controllers.js";
import authorization from '../config/authorization.js';
import passport from "passport";
const productRouter = Router()

productRouter.get('/', passport.authenticate("jwt"), getProducts)
productRouter.get('/:pid', passport.authenticate("jwt"), getProduct)
productRouter.post('/:pid', passport.authenticate("jwt"), authorization("admin"), createProduct)
productRouter.put('/:pid', passport.authenticate("jwt"), authorization("admin"), updateProduct)
productRouter.delete('/:pid', passport.authenticate("jwt"), authorization("admin"), deleteProduct)


export default productRouter