FROM node:18

WORKDIR /app/user_service

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]