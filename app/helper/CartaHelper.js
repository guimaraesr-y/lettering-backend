import models from '../model/models.js'
import APIError from '../error/APIError.js'
import { calcTimeToArrive, getDistanceBetweenPoints } from './distance.js';
import { usuarioHelper } from './UsuarioHelper.js';

const { Carta } = models;

class CartaHelper {

    async sendLetter(remetenteId, destinatarioId, texto, geolocation) {
        if(remetenteId == destinatarioId) throw new APIError("remetente igual destinatario");
        if(!texto || !geolocation) throw new APIError("texto ou geolocalização não podem ser vazios")

        usuarioHelper.setGeolocation(remetenteId, geolocation)

        const dest = await usuarioHelper.findUserById(destinatarioId);
		if(!dest) throw new APIError("remetente não encontrado");
        
        let distance = getDistanceBetweenPoints(geolocation, dest.dataValues.geolocation)
        let { timeToArrive, timestamp } = calcTimeToArrive(distance);

        let letter = await Carta.create({
            remetenteId,
            destinatarioId,
            texto,
            receiveTime: timestamp
        })
        letter.dataValues.timeToArrive = timeToArrive
        return letter;
    }

	async getReceived(userId) {
        let letters = await Carta.findAll({
            where: {
                destinatarioId: userId
            }
        })

        letters = letters.map(letter => {
            let nowTime = new Date(Date.now());
            let arriveTime = new Date(letter.dataValues.receiveTime);
            let timeToArrive = Math.floor((arriveTime - nowTime) / (1000 * 60));
            if(timeToArrive < 0) return letter;
            else return { 
                remetenteId: letter.dataValues.remetenteId,
                destinatarioId: letter.dataValues.destinatarioId,
                timeToArrive: timeToArrive
            }
        })

        return letters
	}

    async getSent(userId) {
        let letters = await Carta.findAll({
            where: {
                remetenteId: userId
            }
        })
        
        letters = letters.map(letter => {
            let nowTime = new Date(Date.now());
            let arriveTime = new Date(letter.dataValues.receiveTime);
            let timeToArrive = Math.floor((arriveTime - nowTime) / (1000 * 60));
            letter.dataValues.timeToArrive = timeToArrive
            return letter
        })

        return letters
        // return await Carta.findAll({
        //     where: {
        //         remetenteId: userId,
        //     },
        // });
    }

}




export const cartaHelper = new CartaHelper();