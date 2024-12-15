# Use Eclipse Temurin as the base image for Java 21
FROM eclipse-temurin:21-jre-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the application JAR file into the container
COPY target/githubwrapped-0.0.1-SNAPSHOT.jar app.jar

# Copy the application configuration file into the container
COPY deployments/application.yml application.yml

# Expose the port that the application will run on
EXPOSE 9009

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]