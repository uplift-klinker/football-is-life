import type {SqliteStatement} from "./sqlite-statement.ts";

import {PAYLOAD_SELECT_FIELDS, PAYLOAD_TABLE_NAME, PayloadTableColumns} from "./oidc-payload-schema.ts";

const FIND_BY_ID_QUERY = `
    select ${PAYLOAD_SELECT_FIELDS}
    from ${PAYLOAD_TABLE_NAME}
    where ${PayloadTableColumns.id} = $id
    and ${PayloadTableColumns.name} = $name
    limit 1;
`;

export function createFindByIdQuery(name: string, id: string): SqliteStatement {
    return {
        sql: FIND_BY_ID_QUERY,
        params: {
            $id: id,
            $name: name
        }
    }
}