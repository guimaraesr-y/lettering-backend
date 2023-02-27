import jwt from 'jsonwebtoken'
import { Router } from "express";
import { usuarioController } from "./app/controller/UsuarioController.js";
import { cartaController } from './app/controller/CartaController.js';

const router = Router()

router.use((req, res, next) => { // verifies jwt token
    if(req.path.startsWith('/user/auth') || req.path.startsWith('/letter/auth')) {
        var token = req.cookies.session;
        
        if (!token) return res.status(401).send({ auth: false, message: 'missing token' });
        
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            req.userData = decoded;
            next();
        });
    } else {
        next();

    }
})

//Routes
router.get("/", (req, res) => res.status(200).json({"ok": "true"}));

// unauthenticated routes
router.post("/user/login", usuarioController.login);
router.post("/user/create", usuarioController.create);

// authenticated routes
router.get("/user/auth/data", usuarioController.data);
router.delete("/user/auth/delete", usuarioController.delete)
router.get("/user/auth/friends/data", usuarioController.friendsData);

router.post("/letter/auth/send/:destinatarioId", cartaController.send);
router.get("/letter/auth/sent", cartaController.getSent);
router.get("/letter/auth/received", cartaController.getReceived);

export { router };