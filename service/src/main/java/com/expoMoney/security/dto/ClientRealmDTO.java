package com.expoMoney.security.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ClientRealmDTO {

    @Id
    private String id;
    private Boolean enabled;
    private String client_id;
    private String secret;
    private String base_url;
    private Long realm_id;

}
