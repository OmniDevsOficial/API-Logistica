FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace

COPY gradlew settings.gradle build.gradle ./
COPY gradle ./gradle
COPY operacional-service/build.gradle operacional-service/
COPY relatorio-service/build.gradle relatorio-service/
COPY relatorio-service/src relatorio-service/src

RUN chmod +x gradlew
RUN --mount=type=cache,target=/root/.gradle \
    ./gradlew :relatorio-service:bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app

RUN groupadd --system spring && useradd --system --gid spring spring
USER spring

COPY --from=build /workspace/relatorio-service/build/libs/relatorio-service.jar app.jar

EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
