import {PAYLOAD_TABLE_NAME, PayloadTableColumns} from "./oidc-payload-schema.ts";
import type {SqliteStatement} from "./sqlite-statement.ts";

const REVOKE_BY_GRANT_ID_SQL = `
    delete from ${PAYLOAD_TABLE_NAME}
    where ${PayloadTableColumns.name} = $name
    and ${PayloadTableColumns.grantId} = $grantId;
`

export function createRevokeByGrantIdCommand(name: string, grantId: string): SqliteStatement {
    return {
        sql: REVOKE_BY_GRANT_ID_SQL,
        params: {
            $name: name,
            $grantId: grantId
        }
    }
}