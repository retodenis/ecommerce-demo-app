package com.retodenis.ecommercedemo.config;

import com.retodenis.ecommercedemo.entity.Country;
import com.retodenis.ecommercedemo.entity.Product;
import com.retodenis.ecommercedemo.entity.ProductCategory;
import com.retodenis.ecommercedemo.entity.State;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import javax.persistence.metamodel.Type;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataRestConfig implements RepositoryRestConfigurer {
    private final EntityManager entityManager;
    private static final Set<Class<?>> classesToDisableUnsupportedActions =
            Set.of(Product.class, ProductCategory.class, Country.class, State.class);

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedActions = {HttpMethod.DELETE, HttpMethod.POST, HttpMethod.PUT};
        classesToDisableUnsupportedActions
                .forEach(clazz -> disableHttpMethodsForClass(config, unsupportedActions, clazz));
        exposeIds(config);
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        config.exposeIdsFor(
                entities.stream()
                        .map(Type::getJavaType).toArray(Class[]::new));
    }

    private void disableHttpMethodsForClass(RepositoryRestConfiguration config, HttpMethod[] unsupportedActions, Class<?> type) {
        config.getExposureConfiguration()
                .forDomainType(type)
                .withItemExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions))
                .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions));
    }
}
