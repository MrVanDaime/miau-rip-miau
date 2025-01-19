FROM node:22

WORKDIR /home/miau-rip-miau

COPY package*.json ./
RUN npm i

COPY . .

EXPOSE 3012

ENTRYPOINT ["npm", "start"]