import dotenv from 'dotenv'



export default {
    user: process.env.USER,
    port: process.env.PORT,
    url_mongo: process.env.URL_MONGO,
    pass_mongo: process.env.PASS_MONGO
}