FROM node:16.14-alpine as nest

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

RUN npm i -g @nestjs/cli
RUN npm i --save-dev @types/node

COPY . .

EXPOSE 3001

# CMD ["npm", "run", "start:dev"]