FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . ./

EXPOSE ${APP_PORT}

CMD [ "npm", "run", "start:debug" ]