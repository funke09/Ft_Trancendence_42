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

dev-kill:
	docker compose kill

re: clean prod

stop:
	docker compose stop

down: stop
	docker compose down

clean: 
	-docker rmi -f $$(docker images "ft_trancendence_42*" | awk 'NR!=1 {print}' | awk '{print $$1}')
	rm -rf backend/dist
	rm -rf backend/node_modules
	rm -rf backend/data
	rm -rf frontend/app/.next
	rm -rf database/data

fclean: clean
	rm -rf backend/node_modules
	rm -rf frontend/node_modules

.PHONY: install prisma-generate prisma-migrate frontend-dev backend-dev all
