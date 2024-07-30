import express from 'express';
import {Server} from 'node:http';
import {createHealthRouter} from "./health/health-router.ts";

export type CreateIdentityServerOptions = {
    port: number;
};

export type IdentityServer = {
    baseUrl: () => Promise<string>;
    start: () => Promise<void>;
    stop: () => Promise<void>;
}

export function createIdentityServer(options: CreateIdentityServerOptions): IdentityServer {
    const app = express();
    app.use('/.health', createHealthRouter());

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