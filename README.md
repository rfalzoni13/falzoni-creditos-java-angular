# Projeto de Demonstração Falzoni Créditos por Renato Falzoni

Este projeto é de simples demonstração, desenvolvido com tecnologia Spring Boot 3 (Java 17) para Back end, Angular 19 para Frontend e com Apache Kafka para troca de mensagens

Após baixar o projeto, para execução do mesmo, pode-se executar cada um individualmente na IDE de sua preferência (seja VS Code ou IntelliJ por exemplo), desde que esteja instalado ou rodando em um container à parte o Apache Kafka apontando para a porta 9092. Ou você pode executar diretamente o arquivo Docker Compose contido na raiz do projeto (recomendado).

Comando para rodar o Docker Compose:

`docker compose up -d`

O banco de dados utilizado na aplicação é o Postgres na versão 17. O mesmo necessitará de ser executado localmente e também é necessário alterar o arquivo application.yml ou criar um arquivo .env para incluir as chaves de conexão para o banco (lembrando que também é necessário alterar no Dockerfile do projeto da API)

O projeto segue rigorosamente os padrões SOLID, YIELD, KISS, DRY para um código mais simples, plausível e de fácil manutenção.

O projeto Falzoni Créditos segue a seguinte estrutura:
- falzoni-creditos-web: Projeto Frontend Angular, que segue a UI e a interface de funcionalidades
- falzoni-java-creditos-nf: Projeto Backend que contém os serviços e regras de negócio
