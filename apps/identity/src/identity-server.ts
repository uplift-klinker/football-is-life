import express from 'express';
import {Server} from 'node:http';
import {createHealthRouter} from "./health/health-router.ts";
import {Database} from "bun:sqlite";
import {createOidcProvider} from "./create-oidc-provider.ts";

export type CreateIdentityServerOptions = {
    port: number;
    db: {
        connectionString: string;
    }
};

export type IdentityServer = {
    baseUrl: () => Promise<string>;
    start: () => Promise<void>;
    stop: () => Promise<void>;
}

export function createIdentityServer(options: CreateIdentityServerOptions): IdentityServer {
    const app = express();
    const database = new Database(options.db.connectionString);
    const provider = createOidcProvider(`http://localhost:${options.port}`, database);

    app.use('/.health', createHealthRouter());
    app.use(provider.callback());

    let server: Server | undefined = undefined;

    return {
        baseUrl: () => new Promise((resolve) => {
            const address = server?.address();
            if (!address) {
                throw new Error('Server must be started before base url is available');
            }

            if (typeof address === 'string') {
                resolve(address);
            } else {
                resolve(`http://localhost:${address.port}`);
            }
        }),
        start: () => new Promise((resolve) => {
            server = app.listen(options.port, resolve);
        }),
        stop: () => new Promise((resolve, reject) => {
            if (!server) {
                resolve();
                return;
            }

            server.close(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }
}