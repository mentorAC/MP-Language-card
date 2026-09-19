package com.maryna.LanguageCard.Controllers;

import org.apache.coyote.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Turns the exceptions the services throw into an answer the client can show.
 *
 * `BadRequestException` is `org.apache.coyote`'s, which extends IOException, so
 * without this it would leave the app as a bare 500 and the UI could only say
 * "something went wrong".
 */
@RestControllerAdvice
public class ApiExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(BadRequestException exception) {
        log.info("Rejected request: {}", exception.getMessage());
        return body(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    /** Bean validation on a @RequestBody: report every field that failed, not just the first. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidBody(MethodArgumentNotValidException exception) {
        var message = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .distinct()
                .collect(Collectors.joining(" "));
        log.info("Rejected invalid body: {}", message);
        return body(HttpStatus.BAD_REQUEST, message.isBlank() ? "The submitted data is invalid." : message);
    }

    /** A foreign key or a NOT NULL the service did not catch first. */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(DataIntegrityViolationException exception) {
        log.warn("Database rejected the change", exception);
        return body(HttpStatus.CONFLICT, "The change conflicts with data that is already saved.");
    }

    private ResponseEntity<Map<String, Object>> body(HttpStatus status, String message) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("timestamp", Instant.now().toString());
        payload.put("status", status.value());
        payload.put("message", message);
        return ResponseEntity.status(status).body(payload);
    }
}
