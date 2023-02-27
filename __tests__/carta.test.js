import request from 'supertest'

import { App } from '../app.js'
import { generateJWT } from '../app/helper/criptografia.js';
import sequelize from '../app/dao/connection.js';
import models from '../app/model/models'

const server = new App().server;
const req = request(server);

const { Usuario, Carta } = models;

let token0, token1;

let u0 = {
    username: "test_user_000",
    password: "test_user_000",
    nome: "Usuário Teste 01"
};

let u1 = {
    username: "test_user_001",
    password: "test_user_001",
    nome: "Usuário Teste 02"
};

let letter = {
    remetente: u0.id,
    destinatario: u1.id,
    texto: "Hello, Dear!\n\nThanks for reading!\n\n\tMr. Programmer"
};

describe("Testando funções das Cartas", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });

        let usuario0 = await Usuario.create(u0);
        let usuario1 = await Usuario.create(u1);
        
        u0.id = usuario0.dataValues.id;
        u1.id = usuario1.dataValues.id;
        
        token0 = await generateJWT({ 
            id: usuario0.dataValues.id,
            username: u0.username, 
            nome: u0.nome
        })
        
        token1 = await generateJWT({ 
            id: usuario1.dataValues.id,
            username: u1.username, 
            nome: u1.nome
        })
    })

    describe("POST /letter/auth/send", () => {
        it("Should send a letter to another user", async () => {
            let res = await req.post("/letter/auth/send/"+u1.id)
                .send(letter)
                .set("content-type", "application/json")
                .set('Cookie', 'session='+token0)
            
            expect(res.status).toBe(200);
        })
        it("Should get all the received letters", async() => {
            let res = await req.get("/letter/auth/received")
                .set("Cookie", "session="+token1)
            expect(res.status).toBe(200)
        })
    })

    // describe("GET /letter/auth/received", () => {
    // })

    afterAll(async () => {
        await sequelize.close();
    })
})