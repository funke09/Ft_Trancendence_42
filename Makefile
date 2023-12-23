install:
	cd frontend && npm install
	cd backend && npm install

prisma-generate:
	cd backend && npx prisma generate

prisma-migrate:
	cd backend && npx prisma migrate dev

frontend-dev:
	cd frontend && npm run dev

backend-dev:
	cd backend && npm run start:dev

studio:
	cd backend && npx prisma studio

run:
	frontend-dev backend-dev

all: install prisma-generate prisma-migrate frontend-dev backend-dev

.PHONY: install prisma-generate prisma-migrate frontend-dev backend-dev all
