package com.retodenis.ecommercedemo.entity.audit;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public abstract class AuditDateAndTime {
    @CreatedDate
    @Column(name = "date_created")
    protected LocalDateTime dateCreated;

    @LastModifiedDate
    @Column(name = "last_updated")
    protected LocalDateTime lastUpdated;
}
