import { Op } from 'sequelize';
import APIError from "../error/APIError.js";
import { compare, encrypt, generateJWT } from "../helper/criptografia.js";
import models from "../model/models.js";

const { Usuario } = models;

class UsuarioHelper {

    async getData(userId) {
        const usuario = await Usuario.findOne({
            where: {
                id: userId
            }
        });
        return usuario;
    }

    async getFriends(userId) {
        return await Usuario.findAll({
            where: {
                id : { [Op.ne]: userId }
            }
        })
    }

    async login(username, password) {
        const usuario = await Usuario.findOne({
            where: {
                username: username
            }
        })

        if(!usuario) {
            throw new APIError("usuário não cadastrado");
        }
        
        if(compare(password, usuario.dataValues.password)) {
            return generateJWT({
                id: usuario.dataValues.id,
                username: username,
                nome: usuario.dataValues.nome
            }) 
        } else {
            throw new APIError("senha incorreta");
        }
    }

    async createUsuario(username, password, nome) {
        if(!username || !password || !nome) {
            throw new APIError("os campos não podem ser vazios");
        }

        return await Usuario.create({
            username,
            password: encrypt(password),
            nome
        })
    }

    async deleteUsuario(userId) {
        return await Usuario.destroy({
            where: {
                id: userId
            }
        })
    }

}

export const usuarioHelper = new UsuarioHelper();