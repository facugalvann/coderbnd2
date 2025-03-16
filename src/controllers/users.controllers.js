import userModel from "../models/users.models.js";


export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).send(users);
    } catch (e) {
        res.status(500).send(e);
    }
};


export const getUser = async (req, res) => {
    try {
        const userId = req.params.id; 
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }
        
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send(e);
    }
};


export const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, age } = req.body;
        const nuevoUsuario = await userModel.create({ first_name, last_name, email, password, age });
        res.status(201).send(`Usuario creado con el id: ${nuevoUsuario._id}`);
    } catch (e) {
        res.status(500).send(e);
    }
};


export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id; 
        const { first_name, last_name, email, password, age } = req.body;
        
        const usuarioActualizado = await userModel.findByIdAndUpdate(
            userId, 
            { first_name, last_name, email, password, age },
            { new: true } 
        );
        
        if (!usuarioActualizado) {
            return res.status(404).send("Usuario no encontrado");
        }

        res.status(200).send(`Usuario actualizado: ${usuarioActualizado}`);
    } catch (e) {
        res.status(500).send(e);
    }
};


export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id; 
        const usuarioEliminado = await userModel.findByIdAndDelete(userId);
        
        if (!usuarioEliminado) {
            return res.status(404).send("Usuario no encontrado");
        }
        
        res.status(200).send(`Usuario eliminado: ${usuarioEliminado}`);
    } catch (e) {
        res.status(500).send(e);
    }
};

export default userModel;
