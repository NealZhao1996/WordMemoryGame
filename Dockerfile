FROM node:18-alpine

WORKDIR /word-memory

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD npm run dev