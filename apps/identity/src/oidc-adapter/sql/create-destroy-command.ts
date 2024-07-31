import type {SqliteStatement} from "./sqlite-statement.ts";
import {PAYLOAD_TABLE_NAME, PayloadTableColumns} from "./oidc-payload-schema.ts";

const DESTROY_COMMAND_SQL = `
    delete from ${PAYLOAD_TABLE_NAME}
    where ${PayloadTableColumns.name} = $name
    and ${PayloadTableColumns.id} = $id;
`;

export function createDestroyCommand(name: string, id: string): SqliteStatement {
    return {
        sql: DESTROY_COMMAND_SQL,
        params: {
            $name: name,
            $id: id,
        }
    }
}