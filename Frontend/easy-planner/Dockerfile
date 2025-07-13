FROM node:22

WORKDIR /Frontend/easy-planner
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "start:docker"]