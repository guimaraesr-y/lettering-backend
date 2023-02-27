import models from '../model/models.js'

const { Carta } = models;

/*
*
*   TODO: Refatorar código aqui adicionando erros e funções nos helpers
*
*/

class CartaController {
    async send(req, res) {
        try {
            const carta = await Carta.create({
                remetenteId: req.userData.id,
                destinatarioId: req.params.destinatarioId,
                texto: req.body.texto
            });
            res.status(200).json(carta);
        } catch (e) {
            if(e.name == 'APIError') res.status(401).json({"ok":false,"error": e.message})
            else res.status(500).json({"ok": false, "error": "Internal Server Error"})
        }
        
    }
    
    async getReceived(req, res) {
        let cartas = await Carta.findAll({
            where: {
                destinatarioId: req.userData.id
            }
        })
        res.status(200).json(cartas);
    }
    
    async getSent(req, res) {
        try {
            const cartas = await Carta.findAll({
                where: {
                    remetenteId: req.userData.id,
                },
            });
            res.status(200).json(cartas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export const cartaController = new CartaController();