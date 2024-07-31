import type {SqliteStatement} from "./sqlite-statement.ts";
import {PAYLOAD_SELECT_FIELDS, PAYLOAD_TABLE_NAME, PayloadTableColumns} from "./oidc-payload-schema.ts";

const FIND_BY_USER_CODE_SQL = `
    select ${PAYLOAD_SELECT_FIELDS}
    from ${PAYLOAD_TABLE_NAME}
    where ${PayloadTableColumns.userCode} = $userCode
    and ${PayloadTableColumns.name} = $name
    limit 1;
`;

export function createFindByUserCodeQuery(name: string, userCode: string): SqliteStatement {
    return {
        sql: FIND_BY_USER_CODE_SQL,
        params: {
            $userCode: userCode,
            $name: name
        }
    }
}