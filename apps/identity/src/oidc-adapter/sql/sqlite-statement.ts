export type SqliteStatement = {
    sql: string;
    params?: Record<string, string | bigint | number | boolean | null>;
}