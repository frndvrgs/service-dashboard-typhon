# service-dashboard-typhon

```
psql --host=localhost --port=5432 --username=postgres --echo-all --file=database.sql
```

```
UPDATE account_data_schema.account SET scope = 'user service' WHERE id = 1;
```

```
export NODE_ENV=production
```

```
$ # View all "INFO" level logs
$ node dist/main.js | grep '"level":30'
```

```
set NODE_ENV=PRODUCTION && node dist/main.js
set NODE_ENV=DEVELOPMENT && node dist/main.js | pino-pretty
```
