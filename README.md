# Projeto de Demonstração Falzoni Créditos por Renato Falzoni

Este projeto é de simples demonstração, desenvolvido com tecnologia Spring Boot 3 (Java 17) para Back end, Angular 19 para Frontend e com Apache Kafka para troca de mensagens

Após baixar ou clonar os projetos, os mesmos podem ser executados cada um individualmente na IDE de sua preferência (seja VS Code ou IntelliJ por exemplo), para isso é necessário que esteja instalado ou rodando em um container à parte o Apache Kafka apontando para a porta 9092. Ou você pode executar diretamente o arquivo Docker Compose contido na raiz do projeto (recomendado).

Os requisitos para executar os projetos são:
- Node (à partir da versão 20+)
- PostgreSQL (à partir da versão 16)
- Java (OpenJDK à partir da versão 17+)
- Docker (com Docker Compose) para execução dos containers

Comando para rodar o Docker Compose:

`docker compose up -d`

O banco de dados utilizado na aplicação é o Postgres na versão 17. O pode ser executado localmente, ou pode ser executado pelo Docker Compose e também é necessário criar um arquivo .env à partir de .env.example para incluir as chaves de conexão para o banco (lembrando que também é necessário alterar no Dockerfile do projeto da API)

O projeto segue rigorosamente os padrões SOLID, YIELD, KISS, DRY para um código mais simples, plausível e de fácil manutenção.

O projeto Falzoni Créditos segue a seguinte estrutura:
- falzoni-creditos-web: Projeto Frontend Angular, que segue a UI e a interface de funcionalidades
- falzoni-java-creditos-nf: Projeto Backend que contém os serviços e regras de negócio

Os projetos por padrão são executados nas seguintes portas (em ambiente de desenvolvimento):
- Bitnami/Kafka: Executado na porta 9092
- Zookeeper: Executado na porta 2181 (uso interno do Kafka)
- Kafka UI: Executado na porta 8081
- Postgres: Executado na porta 5432
- API: Executado na porta 8080
- Web: Executado na porta 3000
