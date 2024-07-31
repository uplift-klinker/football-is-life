import type {Database} from "bun:sqlite";
import Provider from "oidc-provider";
import {createOidcSqliteAdapterFactory} from "./oidc-adapter/oidc-sqlite-adapter.ts";

const DEFAULT_TIME_TO_LIVE = 3600;

export function createOidcProvider(issuerUrl: string, database: Database): Provider {
    const adapterFactory = createOidcSqliteAdapterFactory(database);
    return new Provider(issuerUrl, {
        adapter: adapterFactory,
        ttl: {
            AccessToken: DEFAULT_TIME_TO_LIVE,
            AuthorizationCode: DEFAULT_TIME_TO_LIVE,
            BackchannelAuthenticationRequest: DEFAULT_TIME_TO_LIVE,
            ClientCredentials: DEFAULT_TIME_TO_LIVE,
            IdToken: DEFAULT_TIME_TO_LIVE,
            DeviceCode: DEFAULT_TIME_TO_LIVE,
            Grant: DEFAULT_TIME_TO_LIVE,
            Session: DEFAULT_TIME_TO_LIVE,
            Interaction: DEFAULT_TIME_TO_LIVE,
            RefreshToken: DEFAULT_TIME_TO_LIVE
        }
    });
}