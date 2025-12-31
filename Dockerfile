FROM node:22
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev --ignore-script
COPY ./dist ./dist
EXPOSE 5000
CMD ["npm", "start"]
