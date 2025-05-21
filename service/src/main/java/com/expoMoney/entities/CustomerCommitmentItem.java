package com.expoMoney.entities;

import com.expoMoney.security.utils.StringUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "TB_CUSTOMER_COMMITMENT_ITEM")
@EqualsAndHashCode(of = "id")
public class CustomerCommitmentItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "name_item")
    @NotEmpty(message = "Campo Obrigatório")
    private String nameItem;
    @Column(name = "description_item")
    @NotEmpty(message = "Campo Obrigatório")
    private String descriptionItem;
    @Column(name = "value_item")
    @NotNull(message = "Campo Obrigatório")
    private Double valueItem;
    private Boolean warranty;
    private Boolean Committed;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private Customer customer;

    public String getValueItemFormated(){
        return StringUtils.formatCurrency(this.valueItem > 0 ? this.valueItem : 0);
    }
}
