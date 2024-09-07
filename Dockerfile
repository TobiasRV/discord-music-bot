FROM node:21.7.1
WORKDIR /app
COPY . .
RUN apt-get update || : && apt-get install ffmpeg -y
RUN yarn
CMD ["yarn", "start"]
