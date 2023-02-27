import express from "express";
import cookieParser from "cookie-parser";
import { router } from "./router.js";

export class App {
    constructor() {
        this.server = express();
        this.middleware();
        this.router();
    }
    
    middleware(){
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: true }))
        this.server.use(cookieParser());
    }
    
    router(){
        this.server.use(router);
    }
}