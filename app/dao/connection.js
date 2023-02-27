import dotenv from 'dotenv-safe'
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize("lettering", null, null, {
    dialect: 'sqlite',
    storage: process.env.NODE_ENV == 'test' ? 
        process.env.DB_PATH_TEST : 
        process.env.DB_PATH
})

export default sequelize;