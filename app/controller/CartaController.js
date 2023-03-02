import models from '../model/models.js'
import { cartaHelper } from '../helper/CartaHelper.js';

const { Carta } = models;
const { sendLetter, getReceived, getSent } = cartaHelper;

/*
*
*   TODO: Refatorar código aqui adicionando erros e funções nos helpers
*
*/

class CartaController {
    async send(req, res) {
        try {
            const carta = await sendLetter(
                req.userData.id, 
				req.params.destinatarioId, 
				req.body.texto,
				req.body.geolocation
            )
            
            res.status(200).json(carta);
        } catch (err) {
            console.error(err)
            if(err.name == 'APIError') res.status(401).json({"ok":false,"error": err.message})
            else res.status(500).json({"ok": false, "error": "Internal Server Error"})
        }
    }
    
    async getReceived(req, res) {
        try {
            const cartas = await getReceived(req.userData.id);
            res.status(200).json(cartas);
        } catch (err) {
            if(err.name == 'APIError') res.status(401).json({"ok":false,"error": err.message})
            else res.status(500).json({"ok": false, "error": "Internal Server Error"})
        }
    }
    
    async getSent(req, res) {
        try {
            const cartas = await getSent(req.userData.id);
            res.status(200).json(cartas);
        } catch (err) {
            if(err.name == 'APIError') res.status(401).json({"ok":false,"error": err.message})
            else res.status(500).json({"ok": false, "error": "Internal Server Error"})
        }
    }
}

export const cartaController = new CartaController();