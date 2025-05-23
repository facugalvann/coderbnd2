import cartModel from "../models/carts.models.js";
import ticketModel from "../models/tickets.models.js";
import productModel from "../models/products.models.js";


export const getCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findOne({ _id: cartId })
        if (cart)
            return res.status(200).send(cart)
        else
            return res.status(404).send("Carrito no existe")
    } catch (e) {
        res.status(500).send(e)
    }
}

export const createCart = async (req, res) => {
    try {
        await cartModel.create({ products: [] })
        res.status(201).send("carrito creado con exito")
    } catch (e) {
        res.status(500).send(e)
    }
}

export const insertProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const { quantity } = req.body

        const cart = await cartModel.findOne({ _id: cartId })

        if (cart) {
            const indice = cart.products.findIndex(prod => prod._id == productId)

            if (indice != -1)
                cart.products[indice].quantity = quantity
            else
                cart.products.push({ id_prod: productId, quantity: quantity })

            await cartModel.finByIdAndUpdate(cartId, cart)
            return res.status(400).send("Carrito actualizado con exito")

        } else {
            return res.status(404).send("Carrito no existe")
        }
    } catch (e) {
        res.status(500).send(e)
    }
}



export const deleteProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const cart = await cartModel.findOne({ _id: cartId })
        if (cart) {
            const indice = cart.products.findIndex(prod => prod.id == productId)

            if (indice != -1) {
                cart.products.splice(indice, 1)
                cart.save()
                return res.status(200).send("Producto eliminado correctamente")
            } else {
                return res.status(404).send("Producto no existe")
            }
        } else {
            return res.status(404).send("Carrito no existe")
        }
    } catch (e) {
        res.status(500).send(e)
    }
}

export const deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findOne({ _id: cartId })
        if (cart) {
            cart.products = []
            cart.save()
            return res.status(200).send("Los productos del carrito han sido eliminados")
        } else {
            return res.status(404).send("Carrito no existe")
        }

    } catch (e) {
        res.status(500).send(e)
    }
}

export const checkout = async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findById(cartId)
        const prodSinStock = []

        if (cart) {
            for (const prod of cart.products) {
                let producto = await productModel.findById(prod.id_prod)
                if(producto.stock - prod.quantity < 0) {
                    prodSinStock.push(producto.id)
                }
            }

            if(prodSinStock.length === 0 ) {
                let totalAmount = 0

                for(const prod of cart.products){
                    const producto = await productModel.findById(prod.id_prod)
                    if(producto) {
                        producto.stock -= prod.quantity
                        totalAmount += producto.price * prod.quantity
                        await producto.save()
                    }
                }

                const newTicket = await ticketModel.create({
                    code: crypto.randomUUID(),
                    purchaser: req.user.email,
                    amount: totalAmount,
                    products: cart.products
                })
                await cartModel.findByIdAndUpdate(cartId, {products: []})
                res.status(200).send(newTicket)

            } else {
                prodSinStock.forEach((prodId) => {
                    let indice = cart.products.findIndex(prod => prod.id == prodId) 
                    cart.products.splice(indice,1)
                })
                await cartModel.findByIdAndUpdate(cartId,{
                    products: cart.products
                })
                res.status(400).send(prodSinStock)
            }
        } else {
            res.status(404).send({ message: "Carrito no existe" })
        }
    } catch (e) {
        res.status(500).send({ message: e })
    }
}