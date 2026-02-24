.PHONY: help install setup-backend setup-frontend start-db stop-db start-backend start-frontend clean

install: setup-backend setup-frontend

setup-backend:
	cd backend && npm install

setup-frontend:
	cd frontend && npm install

start-db:
	cd docker && docker-compose up -d

stop-db:
	cd docker && docker-compose down

start-backend:
	cd backend && npm run dev

start-frontend:
	cd frontend && npm start

clean:
	rm -rf backend/node_modules frontend/node_modules
	rm -rf backend/dist frontend/dist

