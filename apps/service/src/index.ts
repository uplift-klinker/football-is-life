import {Elysia} from 'elysia';

const PORT = process.env.SERVICE_PORT ?? 4001;
const app = new Elysia();

app.listen(PORT)
