import {PAYLOAD_TABLE_NAME} from "./payload-table-name.ts";
import type {SqliteQuery} from "./sqlite-query.ts";

const UPSERT_PAYLOAD_SQL = `
    insert into ${PAYLOAD_TABLE_NAME}(name, id, json)
    values ($name, $id, $json)
    on conflict(name, id) do 
    update set json = $json;
`;

export function createPayloadUpsert(name: string, id: string, json: string): SqliteQuery {
    return {
        sql: UPSERT_PAYLOAD_SQL,
        params: {
            $name: name,
            $id: id,
            $json: json,
        }
    }
}