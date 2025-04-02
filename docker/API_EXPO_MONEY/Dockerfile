# Estágio de construção
FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn -f service/pom.xml clean package -DskipTests

# Estágio de execução
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Ajuste o caminho para o módulo específico que contém a aplicação principal
COPY --from=build /app/service/*/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
