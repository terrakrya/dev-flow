FROM node:14.17.0
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json ./


RUN yarn
COPY . .
RUN yarn build
ENV NUXT_HOST=0.0.0.0
ENV HOST=0.0.0.0
ENV NUXT_PORT 8080


EXPOSE 8080            
CMD [ "yarn", "start" ]                                                                                                                                                  