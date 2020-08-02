FROM node:12

# install chrome for protractor tests
#RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
#RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
#RUN apt-get update && apt-get install -yq google-chrome-stable

# Create app directory
WORKDIR /usr/src/app/client

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@9.1.11
# Bundle app source
COPY . .
EXPOSE 4200
CMD ng serve --host 0.0.0.0
