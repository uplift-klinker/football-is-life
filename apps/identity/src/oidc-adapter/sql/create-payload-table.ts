import {PAYLOAD_TABLE_NAME} from "./payload-table-name.ts";

export const CREATE_PAYLOAD_TABLE_SQL = `
    create table if not exists ${PAYLOAD_TABLE_NAME} (
        name TEXT NOT NULL,
        id TEXT NOT NULL,
        json TEXT NOT NULL,
        PRIMARY KEY (name, id)
    );
`;