import {PAYLOAD_TABLE_NAME} from "./payload-table-name.ts";
import type {SqliteStatement} from "./sqlite-statement.ts";
import type {IOidcPayload} from "../oidc-payload.ts";

const UPSERT_PAYLOAD_SQL = `
    insert into ${PAYLOAD_TABLE_NAME}(name, id, json, userCode, uid)
    values ($name, $id, $json, $userCode, $uid)
    on conflict(name, id) do 
    update set json = $json,
               userCode = $userCode,
               uid = $uid;
`;


export function createPayloadUpsertCommand(payload: IOidcPayload): SqliteStatement {
    return {
        sql: UPSERT_PAYLOAD_SQL,
        params: {
            $name: payload.name,
            $id: payload.id,
            $json: payload.json,
            $userCode: payload.userCode ?? null,
            $uid: payload.uid ?? null,
        }
    }
}