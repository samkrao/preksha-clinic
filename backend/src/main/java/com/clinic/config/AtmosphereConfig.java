package com.clinic.config;

import org.atmosphere.cpr.ApplicationConfig;
import org.atmosphere.cpr.AtmosphereServlet;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AtmosphereConfig {

    @Bean
    public ServletRegistrationBean<AtmosphereServlet> atmosphereServlet() {
        ServletRegistrationBean<AtmosphereServlet> registration = 
            new ServletRegistrationBean<>(new AtmosphereServlet(), "/atmosphere/*");
        
        registration.addInitParameter(ApplicationConfig.ANNOTATION_PACKAGE, "com.clinic.atmosphere");
        registration.addInitParameter(ApplicationConfig.WEBSOCKET_SUPPORT, "true");
        registration.addInitParameter(ApplicationConfig.DISABLE_ATMOSPHEREINTERCEPTOR, "false");
        registration.addInitParameter(ApplicationConfig.BROADCASTER_CACHE, 
            "org.atmosphere.cache.UUIDBroadcasterCache");
        registration.addInitParameter(ApplicationConfig.HEARTBEAT_INTERVAL_IN_SECONDS, "60");
        
        registration.setLoadOnStartup(0);
        registration.setAsyncSupported(true);
        
        return registration;
    }
}
