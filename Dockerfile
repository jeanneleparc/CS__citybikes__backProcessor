FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3001

CMD ["npm", "run", "serve"]