FROM node:18-alpine
WORKDIR /opt/app
# ADD package.json package.json
COPY package*.json ./
# ADD . .
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
# RUN npm prune --production
# CMD ["node", "./dist/main.js"]