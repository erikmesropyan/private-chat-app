FROM node:12 AS server-build

# Create app directory
WORKDIR /usr/src/app/server

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8000
CMD [ "node", "server.js" ]
