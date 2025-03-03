import userModel from "../models/users.models.js";

export const getUsers = async (req,res) => {
    try {
        const users = await userModel.find()
        res.status(200).send(users)
    } catch (e) {
        res.status(500).send(e)
    }
}

export const getUSer = async (req,res) => {
    const userId = req.params.uid
}
export default userModel