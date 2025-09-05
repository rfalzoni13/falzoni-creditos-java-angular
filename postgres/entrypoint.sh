#!/bin/bash
set -e

# Espera o PostgreSQL iniciar
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER"; do
  echo "Aguardando o PostgreSQL iniciar..."
  sleep 2
done

# Executa o script SQL para inicializar o banco de dados
psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/setup.sql

echo "Banco de dados inicializado com sucesso."