import jwt from 'jsonwebtoken'

let secretKey = "galvanfacundo004"

export const generateToken = (user) => {
    
    const token = jwt.sign({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        email: user.email,
        rol: user.rol
    }, secretKey, {expiresIn:'24h'})
    return token
}