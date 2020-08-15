FROM node

WORKDIR /app

ADD yarn.lock .
ADD package.json .

ENV PATH /app/node_modules/.bin:$PATH

RUN yarn install

COPY . .