import type {SqliteStatement} from "./sqlite-statement.ts";
import {PAYLOAD_TABLE_NAME, PayloadTableColumns} from "./oidc-payload-schema.ts";

const CONSUME_COMMAND_SQL = `
    update ${PAYLOAD_TABLE_NAME}
    set ${PayloadTableColumns.json} = $json
    where ${PayloadTableColumns.name} = $name
    and ${PayloadTableColumns.id} = $id;
`;


export function createConsumeCommand(name: string, id: string, json: string): SqliteStatement {
    return {
        sql: CONSUME_COMMAND_SQL,
        params: {
            $name: name,
            $id: id,
            $json: json
        },
    }
}