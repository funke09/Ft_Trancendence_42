# Use the official PostgreSQL image as the base image
FROM postgres:latest

# Copy the initialization script to set up the database schema
COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port
EXPOSE 5432
