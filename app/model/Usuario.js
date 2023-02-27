import { DataTypes } from "sequelize";
import sequelize from "../dao/connection.js";

const Usuario = sequelize.define('Usuario', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Usuario