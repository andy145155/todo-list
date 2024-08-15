FROM node:20-alpine

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY . .

EXPOSE 4000
CMD ["yarn", "start"]
