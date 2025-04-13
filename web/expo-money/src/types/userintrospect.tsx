export interface Userintrospect {
    exp: number;
    iat: number;
    jti: string;
    iss: string;
    aud: string;
    sub: string;
    typ: string;
    azp: string;
    sid: string;
    acr: string;
    scope: string;
    email_verified: boolean;
    name: string;
    given_name: string;
    family_name: string;
    email: string;
    client_id: string;
    username: string;
    token_type: string;
    active: boolean;
}