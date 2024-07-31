import type {Adapter, AdapterFactory, AdapterPayload} from "oidc-provider";
import type {Database} from "bun:sqlite";
import type {SqliteStatement} from "./sql/sqlite-statement.ts";
import {CREATE_PAYLOAD_TABLE_SQL} from "./sql/create-payload-table.ts";
import {createPayloadUpsertCommand} from "./sql/create-upsert-payload-command.ts";
import {OidcPayload} from "./oidc-payload.ts";
import {createFindByIdQuery} from "./sql/create-find-by-id-query.ts";
import {createFindByUserCodeQuery} from "./sql/create-find-by-user-code-query.ts";

export function createOidcSqliteAdapterFactory(database: Database): AdapterFactory {
    return (name) => new OidcSqliteAdapter(database, name);
}

export class OidcSqliteAdapter implements Adapter {
    constructor(private readonly database: Database,
                private readonly name: string) {

    }

    async upsert(id: string, payload: AdapterPayload, expiresIn: number): Promise<undefined | void> {
        await this.initialize();
        const command = createPayloadUpsertCommand({
            name: this.name,
            id: id,
            json: JSON.stringify({
                ...payload,
                expiresIn
            }),
            uid: payload.uid,
            userCode: payload.userCode,
        })
        await this.executeCommand(command);
    }

    async find(id: string): Promise<AdapterPayload | undefined | void> {
        await this.initialize();
        const query = createFindByIdQuery(this.name, id);
        const result = await this.executeSingleQuery(query, OidcPayload);
        return result ? result.asPayload() : undefined;
    }

    async findByUserCode(userCode: string): Promise<AdapterPayload | undefined | void> {
        await this.initialize();
        const query = createFindByUserCodeQuery(this.name, userCode);
        const result = await this.executeSingleQuery(query, OidcPayload);
        return result ? result.asPayload() : undefined;
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

    private async executeSingleQuery<TResult>(statement: SqliteStatement, type: new() => TResult): Promise<TResult | undefined> {
        const allMatching = await this.executeQuery(statement, type);
        return allMatching.length === 1
            ? allMatching[0]
            : undefined;
    }

    private async executeQuery<TResult>(statement: SqliteStatement, type: new() => TResult): Promise<TResult[]> {
        return new Promise<TResult[]>((resolve, reject) => {
            try {
                const query = this.database.query(statement.sql)
                    .as(type);

                const result = statement.params
                    ? query.all(statement.params)
                    : query.all();
                query.finalize();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    }

    private async executeCommand(statement: SqliteStatement) {
        return new Promise<void>((resolve, reject) => {
            try {
                const command = this.database.query(statement.sql);
                if (statement.params) {
                    command.run(statement.params);
                } else {
                    command.run();
                }
                command.finalize();
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    }
}