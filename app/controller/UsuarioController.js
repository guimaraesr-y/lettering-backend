import { usuarioHelper } from "../helper/UsuarioHelper.js";

const { 
    getData, 
    getFriends, 
    login, 
    createUsuario, 
    deleteUsuario 
} = usuarioHelper;

class UsuarioController {
    async data(req, res) { // fazer cartas antes 
        try {
            const usuario = await getData(req.userData.id);
            delete(usuario.dataValues.password);
            if(usuario) res.status(200).json(usuario);
        } catch (err) {
            if(err.name == 'APIError') res.status(401).json({"ok":false,"error": err.message})
            else res.status(500).json({"ok": false, "error": "Internal Server Error"})
        }
    }

    async friendsData(req, res) { // falta implementar teste
        try {
            let friends = await getFriends(req.userData.id);
            friends = friends.map(f => ({ id: f.id, username: f.username, createdAt: f.createdAt }));
            res.status(200).json(friends);
        } catch (err) {
            if(err.name == 'APIError') res.status(401).json({"ok":false,"error": err.message})
            else res.status(500).json({"ok": false, "error": "Internal Server Error"})
        }
    }

    async login(req, res) {
        const { username, password } = req.body;

        try {
            const token = await login(username, password);
            res.status(200).json({"ok":true,"token":token});
        } catch (err) {
            if(err.name == 'APIError') res.status(401).json({"ok":false,"error": err.message})
            else res.status(500).json({"ok": false, "error": "Internal Server Error"})
        }
    }

    async create(req, res) {
        const { username, password, nome } = req.body

        try {
            const usuario = await createUsuario(username, password, nome);
            res.status(201).json(usuario);
        } catch (err) {
            if(err.name == 'APIError') res.status(401).json({"ok":false,"error": err.message})
            else res.status(500).json({"ok": false, "error": "Internal Server Error"})
        }
    }

    async delete(req, res) {
        try {
            await deleteUsuario(req.userData.id);
            res.status(200).json({ "ok": true })
        } catch (err) {
            console.log(err)
            if(err.name == 'APIError') res.status(401).json({"ok":false,"error": err.message})
            else res.status(500).json({"ok": false, "error": "Internal Server Error"})
        }
    }
}

export const usuarioController = new UsuarioController();