import models from '../model/models.js'
import APIError from '../error/APIError.js'

const { Carta } = models;

class CartaHelper {

    async sendCarta(remetenteId, destinatarioId, texto) {
        if(remetenteId == destinatarioId) throw new APIError("remetente igual destinatario");
        return await Carta.create({
            remetenteId,
            destinatarioId,
            texto
        });
    }

}

export let cartaHelper = new CartaHelper();