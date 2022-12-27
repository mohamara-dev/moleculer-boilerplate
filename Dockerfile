FROM node:latest

#working directory
WORKDIR /app

#install nano
# RUN apt update
# RUN apt install nano

#install pm2 module
# RUN npm i -g pm2
# RUN npm i -g npm

#install depends
COPY package.json package-lock.json ./
# RUN npm upgrade
# RUN npm i

#copy source
COPY . .

#env setup
ENV NODE_ENV=production

#start server
CMD ["npm","run","start-microservice"]
