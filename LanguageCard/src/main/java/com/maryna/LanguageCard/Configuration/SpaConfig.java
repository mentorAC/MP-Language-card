package com.maryna.LanguageCard.Configuration;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

/**
 * Serves the Angular build that lives in classpath:/static and sends every unknown
 * path back to index.html, so that client side routes (/thema, /card/1, ...) survive
 * a page reload. Backend paths are left alone and keep returning a real 404.
 */
@Configuration
public class SpaConfig implements WebMvcConfigurer {

    private static final String[] BACKEND_PREFIXES = { "api/", "v3/api-docs", "swagger-ui" };

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requested = location.createRelative(resourcePath);
                        if (requested.exists() && requested.isReadable()) {
                            return requested;
                        }
                        for (String prefix : BACKEND_PREFIXES) {
                            if (resourcePath.startsWith(prefix)) {
                                return null;
                            }
                        }
                        return new ClassPathResource("static/index.html");
                    }
                });
    }
}
