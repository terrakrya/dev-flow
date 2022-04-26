FROM node:12.18.1

WORKDIR /devflow

ADD ./ /devflow/

RUN npm install

EXPOSE 3000



