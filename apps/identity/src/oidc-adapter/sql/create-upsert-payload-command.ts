import type {SqliteStatement} from "./sqlite-statement.ts";
import type {IOidcPayload} from "../oidc-payload.ts";
import {PAYLOAD_TABLE_NAME, PayloadTableColumns} from "./oidc-payload-schema.ts";

const UPSERT_PAYLOAD_SQL = `
    insert into ${PAYLOAD_TABLE_NAME}(
        ${PayloadTableColumns.name}, 
        ${PayloadTableColumns.id}, 
        ${PayloadTableColumns.json}, 
        ${PayloadTableColumns.userCode}, 
        ${PayloadTableColumns.uid},
        ${PayloadTableColumns.grantId}
    )
    values ($name, $id, $json, $userCode, $uid, $grantId)
    on conflict(
        ${PayloadTableColumns.name}, 
        ${PayloadTableColumns.id}
    ) do 
    update set ${PayloadTableColumns.json} = $json,
               ${PayloadTableColumns.userCode} = $userCode,
               ${PayloadTableColumns.uid} = $uid,
               ${PayloadTableColumns.grantId} = $grantId;
`;


export function createPayloadUpsertCommand(payload: IOidcPayload): SqliteStatement {
    return {
        sql: UPSERT_PAYLOAD_SQL,
        params: {
            $name: payload.name,
            $id: payload.id,
            $json: payload.json,
            $grantId: payload.grantId ?? null,
            $userCode: payload.userCode ?? null,
            $uid: payload.uid ?? null,
        }
    }
}