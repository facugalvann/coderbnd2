import productModel from '../models/products.models.js'

export const getProducts = async(req,res) => {
    try {
        const {limit, page, metFilter, filter, metOder, ord} = req.query

        const pag = page !== undefined? page : 1 
        const limi = limit !== undefined || limit !== null ? limit : 10 
        
        
        const filQuery = metFilter !== undefined ? {[metFilter] : filter} : {}
        const ordQuery = metOder !== undefined ? {metOder: ord} : {}

        const prods = await productModel.paginate(filQuery, {limit: limi,  page: pag, ordQuery, lean: true})

        prods.pageNumbers = Array.from({length: prods.totalPages}, (_, i) => ({
            number: i + 1,
            isCurrent: i + 1 === prods.page
        }))

        res.status(200).send(prods)

    } catch (e) {
        res.status(500).send
    }
}

export const getProduct = async(req,res) => {
    try {
        const idProd = req.params.idProd
        const prod = await productModel.findById(idProd)
        if(prod)
            res.status(200).send(prod)
        else 
        res.status(404).send({message: "Porducto no existe"})
    } catch (e) {
        res.status(500).send
    }
}

export const createProduct = async(req,res) => {
    try {
        const {title, description, category, code, price, stock} = req.body
        const newProduct = await productModel.create({
            title, description, category, code, price, stock
        })
        res.status(201).send(newProduct)
    } catch (e) {
        res.status(500).send
    }
}

export const updateProduct = async(req,res) => {
    try {
        const idProd = req.params.pid 
        const updateProduct = req.body 
        const rta = await productModel.findByIdAndUpdate(idProd, updateProduct)
        if(rta)
            res.status(200).send(rta)
        else
        res.status(404).send({message: "Producto no existe"})
    } catch (e) {
        res.status(500).send
    }
}

export const deleteProduct = async(req,res) => {
    try {
        const idProd = req.params.pid 
        const rta = await productModel.findByIdAndDelete(idProd)
        if(rta)
            res.status(200).send(rta)
        else
        res.status(404).send({message: "Producto no existe"})
    } catch (e) {
        res.status(500).send
    }
}