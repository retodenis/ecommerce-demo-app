package com.retodenis.ecommercedemo.repository;

import com.retodenis.ecommercedemo.entity.Product;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
class ProductRepositoryTest {
    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ProductRepository productRepository;

    @AfterEach
    void afterEach() {
        entityManager.flush();
    }

    @Test
    void auditDatesPopulated() {
        Product product = new Product();
        String productName = "test name";
        product.setSku("TEST SKU");
        product.setName(productName);
        product.setDescription("Test product");
        product.setUnitPrice(new BigDecimal(100));
        product.setImageUrl("/data/images/1.png");
        product.setActive(true);
        product.setUnitsInStock(1);
        product.setCategoryId(1);

        entityManager.persist(product);

        Optional<Product> productCandidate = productRepository.findByName(productName);
        assertTrue(productCandidate.isPresent());
        Product productFromDb = productCandidate.get();
        assertNotNull(productFromDb.getDateCreated());
        assertNotNull(productFromDb.getLastUpdated());
    }
}