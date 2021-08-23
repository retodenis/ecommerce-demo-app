package com.retodenis.ecommercedemo.repository;

import com.retodenis.ecommercedemo.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@CrossOrigin
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByName(@Param("name") String name);

    /**
     * Used in frontEnd directly as endpoint api/products/search/findByCategoryId?id=2
     * @param id
     * @param pageable
     */
    @SuppressWarnings("unused")
    Page<Product> findByCategoryId(@RequestParam("id") int id, Pageable pageable);

    /**
     * Used in frontEnd directly as endpoint api/products/search/findByNameContainsIgnoreCase?name=someText
     * @param name
     * @param pageable
     */
    @SuppressWarnings("unused")
    Page<Product> findByNameContainsIgnoreCase(@RequestParam("name") String name, Pageable pageable);
}
