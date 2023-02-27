import { App } from "./app.js"
import dotenv from "dotenv-safe"

dotenv.config();
const port = process.env.PORT || 8080;

if(process.env.NODE_ENV !== 'test') {
    new App().server.listen(port, () => console.log('[+] server listening on', port));
}