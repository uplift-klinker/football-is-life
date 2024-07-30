import {describe, test, expect, beforeEach, afterEach} from 'bun:test';
import {createIdentityServer, type IdentityServer} from "./identity-server.ts";

describe('createIdentityServer', () => {
    let server: IdentityServer;
    let baseUrl: string;

    beforeEach(async () => {
        server = createIdentityServer({
            port: 0
        });
    })

    test('should bind server to provided port', async () => {
        await server.start();
        baseUrl = await server.baseUrl();

        const response = await fetch(`${baseUrl}/.health/status`);

        expect(response.status).toBe(200);
    })

    test('when getting address before starting then throws error', async () => {
        await expect(server.baseUrl()).rejects.toThrow(Error);
    })

    afterEach(async () => {
        await server.stop();
    })
})