FROM node:10

RUN mkdir /workdir
COPY ./package.json /workdir/.
RUN mkdir /data
RUN ln -s /workdir/package.json /data/.

WORKDIR /data
RUN npm install && npm install nodemon -g
ENV NODE_PATH /data/node_modules/
WORKDIR /workdir

CMD [ "npm", "start" ]