FROM node:carbon
LABEL maintainer="ehabkhaireldin@gmail.com"
WORKDIR /user/src/app
COPY package*.json ./
ENV NODE_ENV=production 
RUN yarn
COPY . .
CMD ["yarn", "start"]