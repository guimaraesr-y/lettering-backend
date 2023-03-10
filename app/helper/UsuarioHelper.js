import { Op } from 'sequelize';
import APIError from "../error/APIError.js";
import { compare, encrypt, generateJWT } from "../helper/criptografia.js";
import models from "../model/models.js";
import { varyCoordinates, getDistanceBetweenPoints } from './distance.js';

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
        let usuario = await Usuario.findOne({
            where: {
                id: userId
            }
        })
        let friends = await Usuario.findAll({
            where: {
                id : { [Op.ne]: userId }
            }
        })
        return friends.map(friend => ({ 
            id: friend.id, 
            username: friend.username,
            nome: friend.nome,
            geolocation: friend.geolocation,
            distance: getDistanceBetweenPoints(usuario.geolocation, friend.geolocation),
            createdAt: friend.createdAt
        }))
    }

    async login(username, password, geolocation) {
        const usuario = await Usuario.findOne({
            where: {
                username: username
            }
        })

        if(!usuario) {
            throw new APIError("usuário não cadastrado");
        }
        
        if(geolocation) {
            this.setGeolocation(usuario.dataValues.id, geolocation)
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

    async createUsuario(username, password, nome, geolocation) {
        if(!username || !password || !nome || !geolocation) {
            throw new APIError("os campos não podem ser vazios");
        }

        return await Usuario.create({
            username,
            password: encrypt(password),
            nome,
            geolocation
        })
    }

    async deleteUsuario(userId) {
        return await Usuario.destroy({
            where: {
                id: userId
            }
        })
    }

    async setGeolocation(userId, geolocation) {
        geolocation = varyCoordinates(geolocation);

        return await Usuario.update({
            geolocation
        }, {
            where: {
                id: userId
            }
        })
    }

    async findUserById(userId) {
        return await Usuario.findOne({
            where: {
                id: userId
            }
        })
    }

}

export const usuarioHelper = new UsuarioHelper();