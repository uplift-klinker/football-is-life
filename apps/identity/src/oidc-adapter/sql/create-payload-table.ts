import {PAYLOAD_TABLE_NAME, PayloadTableColumns} from "./oidc-payload-schema.ts";

export const CREATE_PAYLOAD_TABLE_SQL = `
    create table if not exists ${PAYLOAD_TABLE_NAME} (
        ${PayloadTableColumns.name} TEXT NOT NULL,
        ${PayloadTableColumns.id} TEXT NOT NULL,
        ${PayloadTableColumns.json} TEXT NOT NULL,
        ${PayloadTableColumns.userCode} TEXT NULL,
        ${PayloadTableColumns.uid} TEXT NULL,
        ${PayloadTableColumns.grantId} TEXT NULL,
        PRIMARY KEY (${PayloadTableColumns.name}, ${PayloadTableColumns.id})
    );
`;