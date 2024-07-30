import {beforeEach, describe, test, expect} from "bun:test";
import {Database} from 'bun:sqlite';
import {createOidcSqliteAdapterFactory, OidcSqliteAdapter} from "./oidc-sqlite-adapter.ts";
import type {AdapterFactory} from "oidc-provider";
import {PAYLOAD_TABLE_NAME} from "./sql/payload-table-name.ts";

describe('OidcSqliteAdapter', () => {
    let database: Database;
    let factory: AdapterFactory;

    beforeEach(() => {
        database = new Database(':memory:');
        factory = createOidcSqliteAdapterFactory(database);
    })

    test('when adapter is created then returns oidc sqlite adapter', async () => {
        const adapter = factory('Grant');

        expect(adapter).toBeInstanceOf(OidcSqliteAdapter);
    })

    test('when new payload is upserted then creates record in database', async () => {
        const adapter = factory('Grant');

        await adapter.upsert('this-is-the-id', {
            aud: ['audience']
        }, 3600);

        const result = database.query(`select id, name, json from ${PAYLOAD_TABLE_NAME};`)
            .all();
        expect(result).toHaveLength(1);
    })
})