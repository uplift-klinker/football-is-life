import {PAYLOAD_SELECT_FIELDS, PAYLOAD_TABLE_NAME, PayloadTableColumns} from "./oidc-payload-schema.ts";
import type {SqliteStatement} from "./sqlite-statement.ts";

const FIND_BY_UID_QUERY_SQL = `
    select ${PAYLOAD_SELECT_FIELDS}
    from ${PAYLOAD_TABLE_NAME}
    where ${PayloadTableColumns.uid} = $uid
    and ${PayloadTableColumns.name} = $name
    limit 1;
`

export function createFindByUidQuery(name: string, uid: string): SqliteStatement {
    return {
        sql: FIND_BY_UID_QUERY_SQL,
        params: {
            $name: name,
            $uid: uid
        }
    }
}