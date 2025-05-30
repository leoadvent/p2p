export interface AccessTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    id_token: string;
    session_state: string;
    scope: string;
    error: string;
    error_description: string;
    error_uri: string;

}