package com.expoMoney.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "USER_REALM", schema = "public")
@EqualsAndHashCode(of = "id")
public class UserRealm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotEmpty(message = "Campo Obrigatório")
    private String username;
    @NotEmpty(message = "Campo Obrigatório")
    @Column(name = "name_realm")
    private String nameRealm;
    @NotEmpty(message = "Campo Obrigatório")
    @Column(name = "id_realm")
    private String idRealm;
    @NotEmpty(message = "Campo Obrigatório")
    private String firstname;
    @NotEmpty(message = "Campo Obrigatório")
    private String lastname;
}
