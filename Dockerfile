FROM node:18.19.0-slim
WORKDIR /app
COPY . .
RUN apt-get update || : && apt-get install python3 build-essential ffmpeg -y
RUN npm install
CMD ["npm", "run", "start"]
