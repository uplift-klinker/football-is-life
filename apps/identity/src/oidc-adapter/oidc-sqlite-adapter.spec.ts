import {beforeEach, describe, test, expect} from "bun:test";
import {Database} from 'bun:sqlite';
import {createOidcSqliteAdapterFactory, OidcSqliteAdapter} from "./oidc-sqlite-adapter.ts";
import type {Adapter, AdapterFactory} from "oidc-provider";
import {OidcPayload} from "./oidc-payload.ts";
import {PAYLOAD_TABLE_NAME} from "./sql/oidc-payload-schema.ts";

const SELECT_PAYLOADS_SQL = `select id, name, json from ${PAYLOAD_TABLE_NAME};`

describe('OidcSqliteAdapter', () => {
    let database: Database;
    let factory: AdapterFactory;
    let adapter: Adapter;

    beforeEach(() => {
        database = new Database(':memory:');
        factory = createOidcSqliteAdapterFactory(database);
        adapter = factory('Grant');
    })

    describe('upsert', () => {
        test('when adapter is created then returns oidc sqlite adapter', async () => {
            expect(adapter).toBeInstanceOf(OidcSqliteAdapter);
        })

        test('when new payload is upserted then creates record in database', async () => {
            await adapter.upsert('this-is-the-id', {
                aud: ['audience']
            }, 3600);

            const result = database.query(SELECT_PAYLOADS_SQL)
                .as(OidcPayload)
                .all();
            expect(result).toHaveLength(1);
            expect(result[0].name).toEqual('Grant');
            expect(result[0].id).toEqual('this-is-the-id');
            expect(result[0].asPayload()).toEqual({
                aud: ['audience'],
                expiresIn: 3600
            });
        })

        test('when existing payload is upserted then updates the existing record', async () => {
            await adapter.upsert('123', {}, 20);
            await adapter.upsert('123', {aud: ['aud']}, 40);

            const result = database.query(SELECT_PAYLOADS_SQL)
                .as(OidcPayload)
                .all();
            expect(result).toHaveLength(1);
            expect(result[0].name).toEqual('Grant');
            expect(result[0].id).toEqual('123');
            expect(result[0].asPayload()).toEqual({aud: ['aud'], expiresIn: 40});
        })
    })

    describe('find', () => {
        test('when finding missing payload then returns undefined', async () => {
            const payload = await adapter.find('this-is-an-id');

            expect(payload).toEqual(undefined);
        })

        test('when finding previously inserted payload then returns payload by id', async () => {
            await adapter.upsert('my-id', {userCode: 'three'}, 2400);

            const payload = await adapter.find('my-id');

            expect(payload).toEqual({userCode: 'three', expiresIn: 2400});
        })
    })

    describe('findByUserCode', () => {
        test('when finding missing payload then returns undefined', async () => {
            const payload = await adapter.findByUserCode('my-user-code');

            expect(payload).toEqual(undefined);
        })

        test('when finding previously inserted payload then returns payload by user code', async () => {
            await adapter.upsert('the-id', {userCode: 'user-code'}, 2400);

            const payload = await adapter.findByUserCode('user-code');

            expect(payload).toEqual({userCode: 'user-code', expiresIn: 2400});
        })
    })
})