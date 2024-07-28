import Provider from 'oidc-provider';

const PORT = process.env.IDENTITY_PORT ?? 4000;
const DEFAULT_TIME_TO_LIVE = 3600;
const ISSUER_IDENTIFIER = `http://localhost:${PORT}`;
const provider = new Provider(ISSUER_IDENTIFIER, {
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

provider.listen(PORT);