FROM node:0.10.38

RUN mkdir /src

RUN npm install nodemon -g

WORKDIR /src
ADD package.json package.json
ADD . app

RUN npm install

ADD nodemon.json nodemon.json
