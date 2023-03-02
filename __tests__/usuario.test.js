import request from 'supertest'

import { App } from '../app.js'
import sequelize from '../app/dao/connection.js';
import { encrypt, generateJWT } from '../app/helper/criptografia.js';
import models from '../app/model/models.js'

const server = new App().server;
const req = request(server);

const { Usuario } = models;

let token;
let data = {
    username: "test_user_000",
    password: "test_user_000",
    nome: "Usuário Teste",
    geolocation: "-23.8942456 -38.1844021"
};

describe("Testando Funções de Usuário", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        
        let usuario = await Usuario.create({
            username: data.username,    
            password: encrypt(data.password),
            nome: data.nome,
            geolocation: data.geolocation
        })
        
        token = generateJWT({
            id: usuario.dataValues.id,
            username: data.username,
            nome: data.nome
        })
    })

    describe("GET /", () => {
        it("Should test connectivity", async() => {
            const res = await req.get("/");
            expect(res.status).toBe(200);
        })
    })

    describe("POST /user/create", () => {
        it("Should return an error - missing paramethers", async () => {
            let wrongData = { username: "test", password: "" }
            const res = await req.post("/user/create").send(wrongData);
            expect(res.status).toBe(401);
        })
        it("Should create user succesfully", async () => {
            const res = await req.post("/user/create")
                .send({
                    username: "testuser",
                    password: "testuser",
                    nome: "testando",
                    geolocation: "-20 -40"
                });
            expect(res.status).toBe(201);
        })
    })

    describe("GET /user/login", () => {
        it("Should return UNAUTHORIZED login - wrong password", async () => {
            const res = await req.post("/user/login")
                .send({ username: data.username, password: '123' })
                .set("content-type", "application/json")
            
            expect(res.status).toBe(401)
        })
        it("Should return JWT token", async () => {
            const res = await req.post("/user/login")
                .send({ username: data.username, password: data.password })
                .set("content-type", "application/json")
            
            expect(res.status).toBe(200)
        })
    })
    
    describe("GET /user/auth/data", () => {
        it("Should return an UNAUTHORIZED error - without token", async () => {
            const res = await req.get('/user/auth/data')
            expect(res.status).toBe(401);
        })
        it("Should return user's data", async () => {
            const res = await req.get('/user/auth/data')
                .set("authorization", token);
            expect(res.status).toBe(200);
            expect(typeof(res.body)).toBe("object");
        })
    })

    describe("GET /user/auth/friends/data", () => {
        it("Should return an UNAUTHORIZED error, all the other users, data", async () => {
            const res = await req.get("/user/auth/friends/data")
            expect(res.status).toBe(401)
        })
        it("Should return user's friends, all the other users, data", async () => {
            const res = await req.get("/user/auth/friends/data")
                .set("authorization", token);
            expect(res.status).toBe(200)
        })
    })

    describe("DELETE /user/auth/delete", () => {

        // => gotta write a test for an invalid delete query

        it("Should delete the test user", async () => {
            const res = await req.delete("/user/auth/delete")
                .set("authorization", token)
            expect(res.status).toBe(200);
        })
    })

    afterAll(async () => {
        await sequelize.close();
    })
})
