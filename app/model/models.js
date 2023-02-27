import Usuario from "./Usuario.js"
import Carta from "./Carta.js"

Usuario.Cartas = Usuario.hasMany(Carta);
Carta.Remetente = Carta.belongsTo(Usuario, {
    as: 'remetente'
});
Carta.Destinatario = Carta.belongsTo(Usuario, {
    as: 'destinatario'
});

Usuario.sync();
Carta.sync();

export default { Usuario, Carta };