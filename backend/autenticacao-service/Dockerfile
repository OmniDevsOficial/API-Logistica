FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace

COPY gradlew settings.gradle build.gradle ./
COPY gradle ./gradle
COPY operacional-service/build.gradle operacional-service/
COPY relatorio-service/build.gradle relatorio-service/
COPY autenticacao-service/build.gradle autenticacao-service/
COPY autenticacao-service/src autenticacao-service/src

RUN chmod +x gradlew
RUN --mount=type=cache,target=/root/.gradle \
    ./gradlew :autenticacao-service:bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app

RUN groupadd --system spring && useradd --system --gid spring spring
USER spring

COPY --from=build /workspace/autenticacao-service/build/libs/autenticacao-service.jar app.jar

EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]