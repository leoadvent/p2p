package com.expoMoney.security.dto;

import lombok.Getter;
import lombok.Setter;
import org.keycloak.representations.idm.RealmRepresentation;
import org.keycloak.representations.idm.UserSessionRepresentation;

@Getter
@Setter
public class SessionDetails {

    private RealmRepresentation realmRepresentation;
    private UserSessionRepresentation userSessionRepresentation;
}
