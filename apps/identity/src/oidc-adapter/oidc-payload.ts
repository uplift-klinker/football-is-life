import type {AdapterPayload} from "oidc-provider";

export class OidcPayload {
    id: string = '';
    name: string = '';
    json: string = '';

    asPayload(): AdapterPayload {
        return JSON.parse(this.json);
    }
}