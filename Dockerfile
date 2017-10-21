FROM node:8

MAINTAINER "philipp-froehlich@hotmail.com"

EXPOSE 5001

WORKDIR /usr/src/app

COPY package.json .

RUN npm install --production

COPY public public

COPY app.js .

CMD ["npm", "start"]