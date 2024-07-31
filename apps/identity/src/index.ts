import {createIdentityServer} from './identity-server';
import {logger} from "@football-is-life/observability";

const PORT = process.env.IDENTITY_PORT ?? 4000;
const DATABASE_CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING ?? 'identity.db';
const server = createIdentityServer({
    port: Number(PORT),
    db: {
        connectionString: DATABASE_CONNECTION_STRING,
    }
});

await server.start();
const baseUrl = await server.baseUrl();
logger.info(`Started identity server at ${baseUrl}`);
