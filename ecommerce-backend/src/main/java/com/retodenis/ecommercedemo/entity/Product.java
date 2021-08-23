package com.retodenis.ecommercedemo.entity;

import com.retodenis.ecommercedemo.entity.audit.AuditDateAndTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Product extends AuditDateAndTime {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String sku;
    private String name;
    private String description;
    private BigDecimal unitPrice;
    private String imageUrl;
    private boolean active;
    private int unitsInStock;
    @Column(name = "category_id", insertable = false, updatable = false)
    private int categoryId;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ProductCategory productCategory;
}
