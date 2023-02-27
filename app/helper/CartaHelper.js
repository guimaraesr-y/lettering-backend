import models from '../model/models.js'
import APIError from '../error/APIError.js'

const { Carta } = models;

class CartaHelper {

    async sendLetter(remetenteId, destinatarioId, texto) {
        if(remetenteId == destinatarioId) throw new APIError("remetente igual destinatario");
        return await Carta.create({
            remetenteId,
            destinatarioId,
            texto
        });
    }

	async getReceived(userId) {
		return await Carta.findAll({
            where: {
                destinatarioId: userId
            }
        })
	}

    async getSent(userId) {
        return await Carta.findAll({
            where: {
                remetenteId: userId,
            },
        });
    }

}

export const cartaHelper = new CartaHelper();