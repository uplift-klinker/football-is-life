import type {SqliteStatement} from "./sqlite-statement.ts";
import {PAYLOAD_TABLE_NAME} from "./payload-table-name.ts";

const FIND_BY_ID_QUERY = `
    select id, name, json
    from ${PAYLOAD_TABLE_NAME}
    where id = $id
    and name = $name
    limit 1
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