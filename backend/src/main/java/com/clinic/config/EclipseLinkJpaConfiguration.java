package com.clinic.config;

import org.eclipse.persistence.config.PersistenceUnitProperties;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.orm.jpa.JpaBaseConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.vendor.AbstractJpaVendorAdapter;
import org.springframework.orm.jpa.vendor.EclipseLinkJpaVendorAdapter;
import org.springframework.transaction.jta.JtaTransactionManager;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class EclipseLinkJpaConfiguration extends JpaBaseConfiguration {

    protected EclipseLinkJpaConfiguration(DataSource dataSource, JpaProperties properties,
                                           ObjectProvider<JtaTransactionManager> jtaTransactionManager) {
        super(dataSource, properties, jtaTransactionManager);
    }

    @Override
    protected AbstractJpaVendorAdapter createJpaVendorAdapter() {
        return new EclipseLinkJpaVendorAdapter();
    }

    @Override
    protected Map<String, Object> getVendorProperties() {
        Map<String, Object> properties = new HashMap<>();
        properties.put(PersistenceUnitProperties.WEAVING, "false");
        properties.put(PersistenceUnitProperties.DDL_GENERATION, PersistenceUnitProperties.CREATE_OR_EXTEND);
        properties.put(PersistenceUnitProperties.DDL_GENERATION_MODE, PersistenceUnitProperties.DDL_DATABASE_GENERATION);
        return properties;
    }
}
