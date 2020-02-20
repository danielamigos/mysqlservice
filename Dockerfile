FROM node:10.17.0

RUN mkdir -p /usr/src/app/bin
WORKDIR /usr/src/app
COPY ./bin /usr/src/app/bin
COPY ./public /usr/src/app/public
COPY ./routes /usr/src/app/routes

COPY ./app.js /usr/src/app
COPY ./package.json /usr/src/app

EXPOSE 8080
RUN npm install
RUN chown -R node /usr/src/app
USER node
#CMD ["./bin/wwww.js"]
CMD node ./bin/www
