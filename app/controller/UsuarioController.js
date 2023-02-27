import { compare, encrypt, generateJWT } from "../helper/criptografia.js";
import models from "../model/models.js";

const { Usuario } = models;

/*
*
*   TODO: Refatorar código aqui adicionando erros e funções nos helpers
*
*/

class UsuarioController {
    async data(req, res) { // fazer cartas antes 
        let user = await Usuario.findOne({
            where: {
                id: req.userData.id
            }
        })
        delete(user.dataValues.password)
        if(user) res.status(200).json(user)
    }

    async friendsData(req, res) {

    }

    async login(req, res) {
        const { username, password } = req.body;

        const user = await Usuario.findOne({
            where: {
                username: username
            }
        })

        if(!user) {
            return res.status(401).json({"ok":false,"error":"usuario nao cadastrado"});
        }
        
        if(compare(password, user.dataValues.password)) {
            res.status(200).json(
                { 
                    "ok": true, 
                    "token": generateJWT({
                        id: user.dataValues.id,
                        username: username,
                        nome: user.dataValues.nome
                    }) 
                }
            );
        }
        else res.status(401).json({"ok":false, "error":"usuario ou senha incorretos"})
    }

    async create(req, res) {
        const { username, password, nome } = req.body
        let user;
        try {
            user = await Usuario.create({
                username,
                password: encrypt(password),
                nome
            })
        } catch (e) {
            user = null;
        }
        if(user) res.status(201).json(user);
        else res.status(401).json({"ok":false, "error":"Erro ao criar usuário"})
    }

    async delete(req, res) {
        Usuario.destroy({
            where: {
                id: req.userData.id
            }
        })
        res.status(200).json({ "ok": true })
    }
}

export const usuarioController = new UsuarioController();