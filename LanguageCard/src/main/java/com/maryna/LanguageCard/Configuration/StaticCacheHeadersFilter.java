package com.maryna.LanguageCard.Configuration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.regex.Pattern;

/**
 * Cache headers for the Angular build.
 *
 * Nothing set Cache-Control before, which left index.html to the browser's
 * heuristic cache: a returning visitor could keep running the previous bundle
 * for hours after a deploy — against an API that had already moved on.
 *
 * The rule is the one the Angular build makes possible. Every emitted script
 * and stylesheet carries a content hash, so its contents can never change and
 * it is cached for a year; everything else — index.html above all — is
 * revalidated on every request, which makes a plain reload enough to pick up a
 * new version. API responses are left to their controllers.
 */
@Component
public class StaticCacheHeadersFilter extends OncePerRequestFilter {

    /** main-O5EE4UJV.js, styles-2RPXPS52.css, chunk-Dk_wPhiJ.js, media/logo-Ab12Cd34.png */
    private static final Pattern HASHED_ASSET =
            Pattern.compile(".*-[A-Za-z0-9_-]{8}[.](?:js|css|woff2?|ttf|otf|png|jpe?g|gif|svg|webp|avif)$");

    private static final String IMMUTABLE = "public, max-age=31536000, immutable";
    private static final String REVALIDATE = "no-cache, must-revalidate";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        var path = request.getRequestURI();

        if (!path.startsWith("/api/")) {
            response.setHeader(HttpHeaders.CACHE_CONTROL,
                    HASHED_ASSET.matcher(path).matches() ? IMMUTABLE : REVALIDATE);
        }

        filterChain.doFilter(request, response);
    }
}
