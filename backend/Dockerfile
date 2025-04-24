FROM maven:3.9-eclipse-temurin-21-jammy AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk-alpine

EXPOSE 8080

WORKDIR /app

COPY --from=build /app/target/horarios-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]