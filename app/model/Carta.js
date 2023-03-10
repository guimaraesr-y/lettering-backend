import { DataTypes } from "sequelize";
import sequelize from "../dao/connection.js";

const Carta = sequelize.define('Carta', {
    texto: {
        type: DataTypes.STRING,
        allowNull: false
    },
	receiveTime: {
		type: DataTypes.DATE,
		allowNull: false
	},
    opened: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

export default Carta