import type {AdapterPayload} from "oidc-provider";

export type IOidcPayload = {
    id: string;
    name: string;
    json: string;
    uid: string | undefined;
    userCode: string | undefined;
}

export class OidcPayload implements IOidcPayload {
    id: string = '';
    name: string = '';
    userCode: string | undefined = undefined;
    uid: string | undefined = undefined;
    json: string = '';

    asPayload(): AdapterPayload {
        return JSON.parse(this.json);
    }
}