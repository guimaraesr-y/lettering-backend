import { DataTypes } from "sequelize";
import sequelize from "../dao/connection.js";

const Carta = sequelize.define('Carta', {
    // remetente: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // destinatario: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    texto: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Carta