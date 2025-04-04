package com.expoMoney.security;

import com.expoMoney.security.dto.*;
import com.expoMoney.security.utils.StringUtils;
import com.expoMoney.security.utils.TokenUtils;
import com.expoMoney.tenancy.multitenancy.SchemaCreator;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.Form;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.RealmsResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.AccessTokenResponse;
import org.keycloak.representations.idm.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class KeycloakService {

    @Value("${keycloak.client.server.url}")
    private String keycloakSereverUrl;
    @Value("${keycloak.client.adminUsuario}")
    private String keycloakClientAdminUsuario;
    @Value("${keycloak.client.adminSenha}")
    private String keycloakClientAdminSenha;
    @Value("${keycloak.client.urlRedirect}")
    private String redirectUri;


    private final ClientRealmDTORepository repository;
    private final SchemaCreator schemaCreator;

    @Bean
    private Keycloak keycloakBuilder() {
        return KeycloakBuilder.builder()
                .serverUrl(keycloakSereverUrl)
                .realm("master")
                .clientId("admin-cli")
                .username(keycloakClientAdminUsuario)
                .password(keycloakClientAdminSenha)
                .build();
    }

    private Keycloak keycloakClientBuilder(String realm, String clientId, String username, String password, String clientSecret){
        return KeycloakBuilder.builder()
                .serverUrl(keycloakSereverUrl + "/auth")
                .realm(realm)
                .clientId(clientId)
                .clientSecret(clientSecret)
                .username(username)
                .password(password)
                .build();
    }

    public RealmRepresentation createRealm(NewRealmDTO dto) {
        try {
            Keycloak keycloak = keycloakBuilder();

            Optional<RealmRepresentation> existingRealm = keycloak.realms().findAll().stream()
                    .filter(r -> r.getRealm().equalsIgnoreCase(dto.getRealmName()))
                    .findFirst();

            if (existingRealm.isPresent()) {
                return existingRealm.get();
            }

            RealmRepresentation realm = new RealmRepresentation();
            realm.setRealm(dto.getRealmName());
            realm.setEnabled(true);

            keycloak.realms().create(realm);
            log.info("Realm {} created successfully!", dto.getRealmName());

            UserRepresentation user = createUser(dto.getRealmName(), dto.getUser());
            changePassword(false, dto.getPassword(), dto.getRealmName(), user.getId());

            List<String> nameRolesDefault = Arrays.asList("ADMINISTRATOR", "USER", "LAYOUT", "DEFAULT", "PRODUCT",
                    "STOCK", "REPLENISHES", "CASHIER", "SUPERVISOR", "MANAGER", "MANAGER_BANKING_AS_A_SERVICE");

            for(String x : nameRolesDefault){
                createRole(x, "Role for " + x.toLowerCase().replaceAll("_", " "), dto.getRealmName());
                assingRole(dto.getRealmName(), x, user.getUsername());
                log.info("Create Role {} for Realm {}", x, dto.getRealmName());
            }

            createClient(dto.getClientId(),dto.getRealmName());

            schemaCreator.createSchema(dto.getRealmName());

            return findRealmByName(dto.getRealmName());

        } catch (Exception e) {
            log.error("Error creating realm: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create realm", e);
        }
    }

    public ClientRepresentation createClient(String clientId, String realmName){

        ClientRepresentation client = new ClientRepresentation();
        client.setClientId(clientId);
        client.setName("Client " + clientId);
        client.setDescription("client SAAS for " + clientId);
        client.setRootUrl("${authBaseUrl}");
        client.setAdminUrl("${authBaseUrl}");
        client.setBaseUrl("/realms/" + realmName + "/account/");
        client.setRedirectUris(List.of("/realms/" + realmName + "/account/*"));
        client.setWebOrigins(Collections.singletonList("+"));
        client.setClientAuthenticatorType("client-secret");
        client.setSecret(StringUtils.generateSecretClientRealm());
        client.setEnabled(true);
        client.setPublicClient(false);
        client.setDirectAccessGrantsEnabled(true);
        client.setFrontchannelLogout(true);

        Map<String, String> attributes = new HashMap<>();
        attributes.put("backchannel.logout.session.required", "true");
        attributes.put("backchannel.logout.revoke.offline.tokens", "true");
        client.setAttributes(attributes);

        RealmResource realmResource = keycloakBuilder().realm(realmName);
        realmResource.clients().create(client);

        return client;
    }

    public RealmRepresentation findRealmByName(String realmName){

        Keycloak keycloak = keycloakBuilder();
        return keycloak.realm(realmName).toRepresentation();
    }

    public void createRole(String nameRole, String desciptionRole, String nameRealm){

        RoleRepresentation role = new RoleRepresentation();
        role.setName(nameRole);
        role.setDescription(desciptionRole);

        Keycloak keycloak = keycloakBuilder();

        keycloak.realm(nameRealm).roles().create(role);
        log.info("Role '{}' created successfully!", nameRole);
    }

    public RoleRepresentation findByRoleName(String realmName, String roleName){

        Keycloak keycloak = keycloakBuilder();
        return keycloak.realm(realmName).roles().list(roleName, true).stream().findFirst().orElseThrow(() -> new NoSuchElementException("Role realm not found " + realmName));
    }

    public void assingRole(String realmName, String roleName, String userName){

        UserRepresentation userRepresentation = findUserByUserName(realmName, userName);
        RoleRepresentation roleRepresentation = findByRoleName(realmName, roleName);
        Keycloak keycloak = keycloakBuilder();

        keycloak.realm(realmName).users().get(userRepresentation.getId()).roles().realmLevel().add(Collections.singletonList(roleRepresentation));
    }

    public UserRepresentation createUser(String realmName, UserRepresentation user ){

        Keycloak keycloak = keycloakBuilder();
        Response response = keycloak.realm(realmName).users().create(user);

        if (response.getStatus() != 201) {
            throw new RuntimeException("Failed to create user: " + response.getStatus());
        }

        return findUsersByUsername(realmName, user.getUsername()).stream().findFirst().orElseThrow(() -> new NoSuchElementException("User not found after create"));
    }

    public UserRepresentation findUserByUserName(String realmName, String userName){

        Keycloak keycloak = keycloakBuilder();
        List<UserRepresentation> users = keycloak.realm(realmName).users().search(userName);

        if(users.isEmpty()){throw new NoSuchElementException("Users not found");}

        return users.stream().findFirst().orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    public List<UserRepresentation> findUsersByUsername(String realmName, String userName){

        Keycloak keycloak = keycloakBuilder();

        return keycloak.realm(realmName).users().search(userName);
    }

    public void changePassword(boolean tempory, String password, String realmName, String userId){

        CredentialRepresentation representation = new CredentialRepresentation();
        representation.setTemporary(tempory);
        representation.setType(CredentialRepresentation.PASSWORD);
        representation.setValue(password);

        Keycloak keycloak = keycloakBuilder();

        keycloak.realm(realmName).users().get(userId).resetPassword(representation);
        log.info("Password set for user {}!", userId);
    }

    public AccessTokenResponse login(LoginRealmClient dto){

        Object[] clientRealm = (Object[]) repository.findClientByRealm(dto.getRealm()).orElseThrow(() -> new NoSuchElementException("Client not found"));

        String clientId = (String) clientRealm[0];
        String clientSecret = (String) clientRealm[1];

        Keycloak keycloak = keycloakClientBuilder(dto.getRealm(), clientId, dto.getUsername(), dto.getPassword(), clientSecret);

        return keycloak.tokenManager().getAccessToken();
    }

    public AccessTokenResponse refreshToken(RefreshTokenLogin refresh, HttpServletRequest request){

        String realm = request.getHeader("X-Tenant-ID");

        String url = keycloakSereverUrl + "/auth/realms/" + realm.toUpperCase() + "/protocol/openid-connect/token";

        Object[] clientRealm = (Object[]) repository.findClientByRealm(realm.toUpperCase()).orElseThrow(() -> new NoSuchElementException("Client not found"));

        String clientId = (String) clientRealm[0];
        String clientSecret = (String) clientRealm[1];

        Form form = new Form();
        form.param("grant_type", "refresh_token");
        form.param("client_id", clientId);
        form.param("client_secret", clientSecret);
        form.param("refresh_token", refresh.getRefreshToken());

        Client client = ResteasyClientBuilder.newBuilder().build();

        try {
            Response response = client.target(url)
                    .request(MediaType.APPLICATION_JSON)
                    .post(Entity.entity(form, MediaType.APPLICATION_FORM_URLENCODED));
            if (response.getStatus() != Response.Status.OK.getStatusCode()) {
                throw new RuntimeException("Erro ao realizar o refresh token, HTTP Status: " + response.getStatus());
            }

            return response.readEntity(AccessTokenResponse.class);

        } finally {
            client.close();
        }
    }

    public Map<String, Object> introspectToken(HttpServletRequest request) {

        Client client = ResteasyClientBuilder.newBuilder().build();
        try {

            String realm = request.getHeader("X-Tenant-ID");

            String url = keycloakSereverUrl + "/auth/realms/" + realm + "/protocol/openid-connect/token/introspect";

            String token = TokenUtils.RetrieveToken(request).substring(7);

            Object[] clientRealm = (Object[]) repository.findClientByRealm(realm).orElseThrow(() -> new NoSuchElementException("Client not found"));

            String clientId = (String) clientRealm[0];
            String clientSecret = (String) clientRealm[1];

            Form form = new Form();
            form.param("client_id", clientId);
            form.param("client_secret", clientSecret);
            form.param("token", token);

            Response response = client.target(url)
                    .request(MediaType.APPLICATION_JSON)
                    .post(Entity.entity(form, MediaType.APPLICATION_FORM_URLENCODED));

            if (response.getStatus() != Response.Status.OK.getStatusCode()) {
                throw new RuntimeException("Erro ao introspectar o token, HTTP Status: " + response.getStatus());
            }

            String json = response.readEntity(String.class);
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(json, Map.class);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao introspectar o token: " + e.getMessage(), e);
        } finally {
            client.close();
        }
    }

    public List<RoleRepresentation> getRealmRoles(HttpServletRequest request) {
        Keycloak keycloak = keycloakBuilder();

        String realmName = TokenUtils.retrieveRealm(request);

        RealmResource realmResource = keycloak.realm(realmName);

        return realmResource.roles().list();
    }

    public List<RoleRepresentation> getRealmRolesByUserId(String userId, HttpServletRequest request) {
        Keycloak keycloak = keycloakBuilder();

        String realmName = TokenUtils.retrieveRealm(request);

        RealmResource realmResource = keycloak.realm(realmName);

        UserResource userResource = realmResource.users().get(userId);

        return userResource.roles().realmLevel().listAll();
    }

    public List<RoleRepresentation> getAvailableRolesByUser(String userId, HttpServletRequest request) {

        String realmName = TokenUtils.retrieveRealm(request);

        Keycloak keycloak = keycloakBuilder();
        RealmResource realmResource = keycloak.realm(realmName);

        UserResource userResource = realmResource.users().get(userId);

        return userResource.roles().realmLevel().listAvailable();
    }

    public void addRealmRolesToUser(String userId, List<String> rolesToAdd, HttpServletRequest request) {

        String realmName = TokenUtils.retrieveRealm(request);

        Keycloak keycloak = keycloakBuilder();

        RealmResource realmResource = keycloak.realm(realmName);
        UserResource userResource = realmResource.users().get(userId);

        List<RoleRepresentation> roles = realmResource.roles().list()
                .stream()
                .filter(role -> rolesToAdd.contains(role.getName()))
                .toList();

        userResource.roles().realmLevel().add(roles);
    }

    public void removeRealmRolesFromUser(String userId, List<String> rolesToRemove, HttpServletRequest request) {

        Keycloak keycloak = keycloakBuilder();

        String realmName = TokenUtils.retrieveRealm(request);

        RealmResource realmResource = keycloak.realm(realmName);
        UserResource userResource = realmResource.users().get(userId);

        List<RoleRepresentation> roles = realmResource.roles().list()
                .stream()
                .filter(role -> rolesToRemove.contains(role.getName()))
                .toList();

        userResource.roles().realmLevel().remove(roles);
    }

    public void removeUser(String userId, HttpServletRequest request) {

        Keycloak keycloak = keycloakBuilder();

        String realmName = TokenUtils.retrieveRealm(request);

        RealmResource realmResource = keycloak.realm(realmName);

        realmResource.users().get(userId).remove();
    }

    public void createIdentityProvider(IdentityProviders providers, HttpServletRequest request) {

        String realmName = TokenUtils.retrieveRealm(request);

        Keycloak keycloak = keycloakBuilder();
        RealmResource realmResource = keycloak.realm(realmName);

        IdentityProviderRepresentation idp = new IdentityProviderRepresentation();
        idp.setAlias(providers.getAlias());
        idp.setProviderId(providers.getProviderId()); // Tipo do provedor (ex.: "oidc" para OpenID Connect)
        idp.setEnabled(true);
        idp.setTrustEmail(true);

        Map<String, String> providerConfig = new HashMap<>();
        providerConfig.put("apiUrl", providers.getConfig().getApiUrl());
        providerConfig.put("baseUrl", providers.getConfig().getBaseUrl());
        providerConfig.put("clientId", providers.getConfig().getClientId());
        providerConfig.put("clientSecret", providers.getConfig().getClientSecret());

        idp.setConfig(providerConfig);

        realmResource.identityProviders().create(idp);
        System.out.println("Identity Provider '" + providers.getAlias() + "' criado com sucesso no realm '" + realmName + "'");
    }

    public Map<String, String> getIdentityProviderLoginLinks(String clientId, HttpServletRequest request) {
        Keycloak keycloak = keycloakBuilder();

        String realmName = TokenUtils.retrieveRealm(request);
        RealmResource realmResource = keycloak.realm(realmName);

        List<IdentityProviderRepresentation> identityProviders = realmResource.identityProviders().findAll();
        Map<String, String> loginLinks = new HashMap<>();

        for (IdentityProviderRepresentation idp : identityProviders) {
            if (idp.isEnabled()) {
                String loginLink = String.format(
                        "%s/auth/realms/%s/protocol/openid-connect/auth?client_id=%s&response_type=code&scope=openid&redirect_uri=%s&kc_idp_hint=%s",
                        keycloakSereverUrl,
                        realmName,
                        clientId,
                        redirectUri,
                        idp.getAlias()
                );
                loginLinks.put(idp.getAlias(), loginLink);
            }
        }

        keycloak.close();
        return loginLinks;
    }

    public AccessTokenResponse exchangeCodeForToken(String code, String sessionState) {

        Keycloak keycloak = keycloakBuilder();

        SessionDetails sessionDetails = getSessionDetails(sessionState, keycloak);
        String realmName = sessionDetails.getRealmRepresentation().getRealm();
        UserSessionRepresentation sessionRepresentation = sessionDetails.getUserSessionRepresentation();

        String clientId = "";

        for(Map.Entry<String, String>  x : sessionRepresentation.getClients().entrySet()){
            clientId = x.getValue();
        }

        Object[] clientRealm = (Object[]) repository.findByClientName(clientId).orElseThrow(() -> new NoSuchElementException("Client not found"));

        String clientSecret = (String) clientRealm[3];

        String tokenUrl = String.format("%s/auth/realms/%s/protocol/openid-connect/token", "http://localhost:8090", realmName); // Substitua pelo servidor do Keycloak

        // Parâmetros da requisição
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "authorization_code");
        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);
        form.add("redirect_uri", redirectUri);
        form.add("code", code);

        // Headers da requisição
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.valueOf(MediaType.APPLICATION_FORM_URLENCODED));

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);

        RestTemplate restTemplate = new RestTemplate();

        // Fazer a requisição
        ResponseEntity<AccessTokenResponse> response  = restTemplate.postForEntity(tokenUrl, request, AccessTokenResponse.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            throw new RuntimeException("Erro ao trocar o código pelo token: " + response.getBody());
        }
    }

    private SessionDetails getSessionDetails(String sessionState, Keycloak keycloak) {

        List<RealmRepresentation> realms = keycloak.realms().findAll().stream().toList();

        for (RealmRepresentation realm : realms) {
            List<UserSessionRepresentation> sessions = keycloak.realm(realm.getRealm())
                    .clients()
                    .findAll()
                    .stream()
                    .flatMap(client -> keycloak.realm(realm.getRealm()).clients().get(client.getId()).getUserSessions(0, 100).stream())
                    .collect(Collectors.toList());

            for (UserSessionRepresentation session : sessions) {
                if (session.getId().equals(sessionState)) {
                    SessionDetails sessionDetails = new SessionDetails();
                    sessionDetails.setRealmRepresentation(realm);
                    sessionDetails.setUserSessionRepresentation(session);
                    return sessionDetails;
                }
            }
        }
        throw new RuntimeException("Sessão não encontrada em nenhum realm");
    }

}
