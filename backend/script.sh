# wait-for-postgres.sh
until nc -z -v -w30 postgres 5432
do
  echo "Waiting for postgres database connection..."
  sleep 1
done
echo "Postgres is up and running"