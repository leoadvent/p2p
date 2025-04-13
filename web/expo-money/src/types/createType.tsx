interface user {
    username: string,
    enabled: boolean,
    emailVerified: boolean,
    firstName: string,
    lastName: string,
    email: string,
}

export interface Realm {
    realmName: string,
    clientId: string,
    description: string,
    password: string,
    user: user,
}