import 'dotenv/config'
import jwt from 'jsonwebtoken'


export const generateToken = (user) => {
    
    const token = jwt.sign({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        email: user.email,
        rol: user.rol
    }, procces.env.JWT_SECRET, {expiresIn:'24h'})
    return token
}