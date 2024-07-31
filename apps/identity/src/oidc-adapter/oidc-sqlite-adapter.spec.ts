import {beforeEach, describe, test, expect, setSystemTime} from "bun:test";
import {Database} from 'bun:sqlite';
import {createOidcSqliteAdapterFactory, OidcSqliteAdapter} from "./oidc-sqlite-adapter.ts";
import type {Adapter, AdapterFactory} from "oidc-provider";
import {OidcPayload} from "./oidc-payload.ts";
import {PAYLOAD_SELECT_FIELDS, PAYLOAD_TABLE_NAME} from "./sql/oidc-payload-schema.ts";

const SELECT_PAYLOADS_SQL = `select ${PAYLOAD_SELECT_FIELDS} from ${PAYLOAD_TABLE_NAME};`
const CURRENT_TIME = new Date('2024-07-30T00:00:00.000Z');
const CURRENT_EPOCH_MILLISECONDS = CURRENT_TIME.getTime();

describe('OidcSqliteAdapter', () => {
    let database: Database;
    let factory: AdapterFactory;
    let adapter: Adapter;

    beforeEach(() => {
        setSystemTime(CURRENT_TIME);

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
            }, 3);

            const result = database.query(SELECT_PAYLOADS_SQL)
                .as(OidcPayload)
                .all();
            expect(result).toHaveLength(1);
            expect(result[0].name).toEqual('Grant');
            expect(result[0].id).toEqual('this-is-the-id');
            expect(result[0].asPayload()).toEqual({
                aud: ['audience'],
                expiresAt: '2024-07-30T00:00:03.000Z'
            });
        })

        test('when existing payload is upserted then updates the existing record', async () => {
            await adapter.upsert('123', {}, 20);
            await adapter.upsert('123', {aud: ['aud']}, 4);

            const result = database.query(SELECT_PAYLOADS_SQL)
                .as(OidcPayload)
                .all();
            expect(result).toHaveLength(1);
            expect(result[0].name).toEqual('Grant');
            expect(result[0].id).toEqual('123');
            expect(result[0].asPayload()).toEqual({aud: ['aud'], expiresAt: '2024-07-30T00:00:04.000Z'});
        })
    })

    describe('find', () => {
        test('when finding missing payload then returns undefined', async () => {
            const payload = await adapter.find('this-is-an-id');

            expect(payload).toEqual(undefined);
        })

        test('when finding previously inserted payload then returns payload by id', async () => {
            await adapter.upsert('my-id', {userCode: 'three'}, 2);

            const payload = await adapter.find('my-id');

            expect(payload).toEqual({userCode: 'three', expiresAt: '2024-07-30T00:00:02.000Z'});
        })
    })

    describe('findByUserCode', () => {
        test('when finding missing payload then returns undefined', async () => {
            const payload = await adapter.findByUserCode('my-user-code');

            expect(payload).toEqual(undefined);
        })

        test('when finding previously inserted payload then returns payload by user code', async () => {
            await adapter.upsert('the-id', {userCode: 'user-code'}, 2);

            const payload = await adapter.findByUserCode('user-code');

            expect(payload).toEqual({userCode: 'user-code', expiresAt: '2024-07-30T00:00:02.000Z'});
        })
    })

    describe('findByUid', () => {
        test('when finding missing payload then returns undefined', async () => {
            const payload = await adapter.findByUid('my-uid');

            expect(payload).toEqual(undefined);
        })

        test('when finding previously inserted payload then returns payload by user code', async () => {
            await adapter.upsert('the-id', {uid: 'some-uuid'}, 3);

            const payload = await adapter.findByUid('some-uuid');

            expect(payload).toEqual({uid: 'some-uuid', expiresAt: '2024-07-30T00:00:03.000Z'});
        })
    })

    describe('consume', () => {
        test('when payload consumed then payload consumed is updated', async () => {
            await adapter.upsert('the-id', {uid: 'some-uuid'}, 3);

            await adapter.consume('the-id');
            const payload = await adapter.find('the-id');

            expect(payload?.consumed).toEqual(1722297600);
        })
    })

    describe('destroy', () => {
        test('when payload destroyed then deletes payload from database', async () => {
            await adapter.upsert('the-id', {uid: 'some-uuid'}, 3);

            await adapter.destroy('the-id');
            const payload = await adapter.find('the-id');

            expect(payload).toEqual(undefined);
        })
    })
})