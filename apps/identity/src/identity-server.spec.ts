import {describe, test, expect, beforeEach, afterEach} from 'bun:test';
import {createIdentityServer, type IdentityServer} from "./identity-server.ts";

describe('createIdentityServer', () => {
    let server: IdentityServer;
    let baseUrl: string;

    beforeEach(async () => {
        server = createIdentityServer({
            port: 0
        });
        await server.start();
        baseUrl = await server.baseUrl();
    })

    test('should bind server to provided port', async () => {
        const response = await fetch(`${baseUrl}/.health/status`);

        expect(response.status).toBe(200);
    })

    afterEach(async () => {
        await server.stop();
    })
})