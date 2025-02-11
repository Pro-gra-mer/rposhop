# Usa una imagen base de OpenJDK (Java 21 para compatibilidad con tu proyecto)
FROM eclipse-temurin:21-jdk

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo JAR generado al contenedor
COPY target/*.jar app.jar

# Expone el puerto en el que correrá el servicio
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "app.jar"]
