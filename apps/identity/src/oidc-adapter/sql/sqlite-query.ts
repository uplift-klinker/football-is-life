export type SqliteQuery = {
    sql: string;
    params?: Record<string, string | bigint | number | boolean | null>;
}