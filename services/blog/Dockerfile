FROM node:18

WORKDIR /app/bolg_service

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm", "start"]