gymtrack-api/
├── DECISIONS.md CONTRACT.md README.md # CONTRACT.md in Phase D
├── docker-compose.yml .env.example # Phase C
├── migrations/ 001_users.sql … 005_indexes.sql
├── seeds/ 001_dev.sql
├── http/ health.http auth.http rules.http …
├── test/ setup.ts helpers/ *.test.ts # Phase N
└── src/
├── app.ts # builds the app, exports it
├── server.ts # only listens, handles shutdown
├── worker.ts # Phase M: separate process
├── routes.ts # mounts every module's router
├── config/env.ts # Zod-validated, frozen
├── lib/ # logger.ts, errors.ts, redis.ts, cache.ts, cloudinary.ts
├── db/ # pool.ts, migrate.ts, withTransaction.ts, seed.ts
├── middleware/ # requestId, validate, requireAuth, requireRole,
│ # notFound, errorHandler, rateLimit, upload
├── types/ # express.d.ts (req.user), api.ts (response shapes)
├── modules/
│ ├── health/
│ ├── auth/ # routes, controller, service, schemas, google.ts
│ ├── users/ # repository only (auth uses it)
│ ├── plans/
│ ├── members/ # includes photo upload
│ ├── memberships/
│ ├── check-ins/
│ ├── dashboard/
│ ├── classes/
│ └── bookings/
├── jobs/ # queue.ts, reminders.job.ts, bookingReminder.job.ts
└── events/ # Pub/Sub publisher and subscriber
