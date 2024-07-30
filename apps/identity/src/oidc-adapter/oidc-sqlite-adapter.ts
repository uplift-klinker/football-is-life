import type {Adapter, AdapterFactory, AdapterPayload} from "oidc-provider";
import type {Database} from "bun:sqlite";
import type {SqliteQuery} from "./sql/sqlite-query.ts";
import {CREATE_PAYLOAD_TABLE_SQL} from "./sql/create-payload-table.ts";
import {createPayloadUpsert} from "./sql/upsert-payload.ts";

export function createOidcSqliteAdapterFactory(database: Database): AdapterFactory {
    return (name) => new OidcSqliteAdapter(database, name);
}

export class OidcSqliteAdapter implements Adapter {
    constructor(private readonly database: Database,
                private readonly name: string) {

    }

    async upsert(id: string, payload: AdapterPayload, expiresIn: number): Promise<undefined | void> {
        const json = JSON.stringify({
            ...payload,
            expiresIn
        })
        await this.initialize();
        await this.executeCommand(createPayloadUpsert(this.name, id, json));
    }

    find(id: string): Promise<AdapterPayload | undefined | void> {
        throw new Error("Method not implemented.");
    }

    findByUserCode(userCode: string): Promise<AdapterPayload | undefined | void> {
        throw new Error("Method not implemented.");
    }

    findByUid(uid: string): Promise<AdapterPayload | undefined | void> {
        throw new Error("Method not implemented.");
    }

    consume(id: string): Promise<undefined | void> {
        throw new Error("Method not implemented.");
    }

    destroy(id: string): Promise<undefined | void> {
        throw new Error("Method not implemented.");
    }

    revokeByGrantId(grantId: string): Promise<undefined | void> {
        throw new Error("Method not implemented.");
    }

    private async initialize() {
        await this.executeCommand({
            sql: CREATE_PAYLOAD_TABLE_SQL
        })
    }

    private async executeCommand(query: SqliteQuery) {
        return new Promise<void>((resolve, reject) => {
            try {
                const statement = this.database.query(query.sql);
                if (query.params) {
                    statement.run(query.params);
                } else {
                    statement.run();
                }
                statement.finalize();
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    }
}