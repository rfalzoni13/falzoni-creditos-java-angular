FROM openjdk:17-alpine
LABEL authors="Renato Falzoni"
LABEL application="Falzoni Java Créditos NF"
LABEL version="1.0.0"
WORKDIR /app
COPY target/falzoni-java-creditos-nf-1.0.0.jar app.jar
EXPOSE 8080
ENV DATABASE_URL="jdbc:postgresql://host.docker.internal:5432/postgres?currentSchema=credito"
ENV DB_USERNAME="<seu-username>"
ENV DB_PASSWORD="<seu-password>"
ENTRYPOINT ["java", "-jar", "app.jar"]