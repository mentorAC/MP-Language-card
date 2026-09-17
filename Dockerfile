# ---------- 1. Angular client ----------
FROM node:24-alpine AS client
WORKDIR /client

COPY clientA/package.json clientA/package-lock.json ./
# --legacy-peer-deps: ngx-toastr still declares Angular 21 peers while the app is on
# Angular 22; the same flag is needed for a plain local `npm install`.
RUN npm ci --legacy-peer-deps

COPY clientA/ ./
RUN npm run build -- --configuration production

# ---------- 2. Spring Boot server (serves the client as static resources) ----------
FROM eclipse-temurin:26-jdk AS server
WORKDIR /build

COPY LanguageCard/.mvn/ .mvn/
COPY LanguageCard/mvnw LanguageCard/pom.xml ./
RUN sh ./mvnw -B -ntp dependency:go-offline

COPY LanguageCard/src/ src/
COPY --from=client /client/dist/clientA/browser/ src/main/resources/static/
RUN sh ./mvnw -B -ntp -DskipTests package

# ---------- 3. runtime ----------
FROM eclipse-temurin:26-jre-alpine AS runtime
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring

COPY --from=server /build/target/*.jar app.jar
RUN chown spring:spring app.jar

USER spring
EXPOSE 8080

ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
