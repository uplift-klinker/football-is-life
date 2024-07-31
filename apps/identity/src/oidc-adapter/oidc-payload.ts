import type {AdapterPayload} from "oidc-provider";

export type IOidcPayload = {
    id: string;
    name: string;
    json: string;
    uid: string | undefined;
    userCode: string | undefined;
    grantId: string | undefined;
}

export class OidcPayload implements IOidcPayload {
    id: string = '';
    name: string = '';
    json: string = '';
    grantId: string | undefined = undefined;
    userCode: string | undefined = undefined;
    uid: string | undefined = undefined;

    asPayload(): AdapterPayload {
        return JSON.parse(this.json);
    }
}