# Imagen base para la construcción del proyecto con Maven y Java 21
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /app

# Copia el archivo pom.xml y descarga las dependencias necesarias
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia el código fuente y construye la aplicación
COPY src ./src
RUN mvn clean package -DskipTests

# Imagen base para ejecutar Java 21
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copia el jar generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Expone el puerto de la aplicación
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
