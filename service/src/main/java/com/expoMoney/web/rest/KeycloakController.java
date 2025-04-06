package com.expoMoney.web.rest;


import com.expoMoney.security.KeycloakService;
import com.expoMoney.security.dto.IdentityProviders;
import com.expoMoney.security.dto.LoginRealmClient;
import com.expoMoney.security.dto.NewRealmDTO;
import com.expoMoney.security.dto.RefreshTokenLogin;
import com.expoMoney.security.utils.TokenUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.representations.AccessTokenResponse;
import org.keycloak.representations.idm.RealmRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/keycloak")
public class KeycloakController {

    private final KeycloakService service;

    @PostMapping
    @Operation(tags = {"KEYCLOAK"}, summary = "criando novo realm",
            description = "Requisicao POST para criar novo realm"
    )
    public ResponseEntity<RealmRepresentation> createRealm(@RequestBody @Valid NewRealmDTO dto){
        log.info("REQUISICAO POST PARA CRIAR UM NOVO REALM");
        RealmRepresentation realm = service.createRealm(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/{id}").buildAndExpand(realm.getId()).toUri();
        return ResponseEntity.created(uri).body(realm);
    }

    @PostMapping("/login")
    @Operation(tags = {"KEYCLOAK"}, summary = "Realizar Login por Realm e Client",
            description = "Requisicao POST para Realizar Login por Realm e Client"
    )
    public ResponseEntity<AccessTokenResponse> login(@RequestBody @Valid LoginRealmClient login){
        log.info("REQUISICAO POST PARA REALIZAR LOGIN POR RELM: {}", login.getRealm());
        return ResponseEntity.ok(service.login(login));
    }

    @PostMapping("/refreshToken")
    @Operation(tags = {"KEYCLOAK"}, summary = "Realizar Login por Realm e Client",
            description = "Requisicao POST para Realizar Login por Realm e Client", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<AccessTokenResponse> refreshToken(@RequestBody @Valid RefreshTokenLogin refreshToken, HttpServletRequest request){
        log.info("REQUISICAO POST PARA REALIZAR REFRESH TOKEN");
        return ResponseEntity.ok(service.refreshToken(refreshToken, request));
    }

    @GetMapping("/findUser/{realm}/{nameUser}")
    @Operation(tags = {"KEYCLOAK"}, summary = "Realizar Busca De usuario Pelo Nome E Realm",
            description = "Requisicao GET para Realizar Busca De usuario Pelo Nome E Realm", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<UserRepresentation> findUser(@PathVariable("realm") String realm, @PathVariable("nameUser") String nameUser){
        log.info("Busca Usuario pelo Realm: {}", realm);
        return ResponseEntity.ok(service.findUserByUserName(realm, nameUser));
    }

    @GetMapping("/userintrospect")
    @Operation(tags = {"KEYCLOAK"}, summary = "Realizar Busca De Usuario Introspect",
            description = "Requisicao POST para Realizar Busca De Usuario Introspect", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<Map<String, Object>> findUserIntrospect(HttpServletRequest request){
        log.info("BUSCA USER INTROSPECT REALM: {}", request.getHeader("X-Tenant-ID"));
        return ResponseEntity.ok(service.introspectToken(request));
    }

    @GetMapping("/findrolesbyrealm")
    @Operation(tags = {"KEYCLOAK"}, summary = "Realizar Busca De Roles por Realm",
            description = "Requisicao GET para Realizar Busca De Roles por Realm", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<List<RoleRepresentation>> findRolesByRealm(HttpServletRequest request){
        log.info("REQUISICAO GET PARA RECUPERAR ROLES POR REALM");
        return ResponseEntity.ok(service.getRealmRoles(request));
    }

    @PostMapping("/createuser")
    @Operation(tags = {"KEYCLOAK"}, summary = "Criacao de um Novo Usuario",
            description = "Requisicao POST para Criacao de um Novo Usuario", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<UserRepresentation> createUser (@RequestBody UserRepresentation user, HttpServletRequest request){
        log.info("REQUISICAO POST PARA CRIAR UM NOVO USUARIO");
        String realmName = TokenUtils.retrieveRealm(request);
        user = service.createUser(realmName, user);
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/{id}").buildAndExpand(user.getId()).toUri();
        return ResponseEntity.created(uri).body(user);
    }

    @PutMapping("/chagepassword/{idUser}")
    @Operation(tags = {"KEYCLOAK"}, summary = "Resetar Senha Usuario",
            description = "Requisicao PUT para Resetar Senha Usuario", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<Void> resetPassWord(@RequestBody String senha, @PathVariable("idUser")String idUser,  HttpServletRequest request){
        log.info("REQUISICAO PUT PARA RESETAR A SENHA DO USUARIO");
        String realmName = TokenUtils.retrieveRealm(request);
        service.changePassword(false, senha, realmName, idUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/availableRolesByUser/{idUser}")
    @Operation(tags = {"KEYCLOAK"}, summary = "Recuperar Roles por Usuario",
            description = "Requisicao GET para Recuperar Roles por Usuario", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<List<RoleRepresentation>> availableRolesByUser(@PathVariable("idUser")String idUser, HttpServletRequest request){
        log.info("REQUISICAO GET PARA RECUPERAR ROLES DISPONIVEIS DE UM USUARIO");
        return ResponseEntity.ok(service.getAvailableRolesByUser(idUser, request));
    }

    @GetMapping("/realmRolesByUserId/{idUser}")
    @Operation(tags = {"KEYCLOAK"}, summary = "Recuperar Roles de um Usuario",
            description = "Requisicao GET para Recuperar Roles por Usuario", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<List<RoleRepresentation>> realmRolesByUserId(@PathVariable("idUser")String idUser, HttpServletRequest request){
        log.info("REQUISICAO GET PARA RECUPERAR ROLES DE UM USUARIO");
        return ResponseEntity.ok(service.getRealmRolesByUserId(idUser, request));
    }

    @PostMapping("/addrolebyuserid/{idUsuario}")
    @Operation(tags = {"KEYCLOAK"}, summary = "Adicionar Roles por Usuario",
            description = "Requisicao POST para Adicionar Roles por Usuarioo", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<Void> addRealmRolesToUser (@PathVariable("idUsuario") String idUsuario, @RequestBody List<String> rolesToAdd, HttpServletRequest request){
        log.info("REQUISICAO POST PARA ADCIONAR ROLES POR USUARIO");
        service.addRealmRolesToUser(idUsuario, rolesToAdd, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/removerolesbyuserid/{userId}")
    @Operation(tags = {"KEYCLOAK"}, summary = "Remover Roles por Usuario",
            description = "Requisicao DELETE para Remover Roles por Usuario", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<Void> deleteRolesByUserId(@PathVariable("userId") String userId, @RequestBody List<String> rolesToRemove, HttpServletRequest request){
        log.info("REQUISICAO DELETE PARA REMOVER ROLES DE UM USUARIO");
        service.removeRealmRolesFromUser(userId, rolesToRemove, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/romoveuserbyid/{userId}")
    @Operation(tags = {"KEYCLOAK"}, summary = "Remover Um Usuario",
            description = "Requisicao DELETE para Remover Um Usuario", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<Void> removeuserbyid(@PathVariable("userId") String userId, HttpServletRequest request){
        log.info("REQUISICAO DELETE PARA REMOVER UM USUARIO");
        service.removeUser(userId, request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/createIdentityProvider")
    @Operation(tags = {"KEYCLOAK"}, summary = "Criar SSO Social",
            description = "Requisicao POST para Criar SSO Social", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<Void> createIdentityProvider (@RequestBody IdentityProviders providers, HttpServletRequest request){
        log.info("REQUISICAO POST PARA ADCIONAR IDENTITY PROVIDER");
        service.createIdentityProvider(providers, request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/identityProviderLoginLinks/{clientId}")
    @Operation(tags = {"KEYCLOAK"}, summary = "Recuperar Links Login SSO Social",
            description = "Requisicao GET para Recuperar Links Login SSO Social", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<Map<String, String>> identityProviderLoginLinks(@PathVariable("clientId")  String clientId, HttpServletRequest request){
        log.info("REQUISICAO GET PARA RECUPERAR LINKS DE LOGINS");
        return ResponseEntity.ok(service.getIdentityProviderLoginLinks(clientId, request));
    }

    @GetMapping("/code/sso")
    @Operation(tags = {"KEYCLOAK"}, summary = "Troca code pelo Token",
            description = "Requisicao POST para Troca code pelo Token"
    )
    public ResponseEntity<AccessTokenResponse> handleKeycloakCallback(
            @RequestParam("code") String code,
            @RequestParam("session_state") String sessionState,
            HttpServletRequest request) {
        log.info("TROCANDO CODE SSO POR UM TOKEN: {}", code);
        return ResponseEntity.ok(service.exchangeCodeForToken(code, sessionState));
    }
}
