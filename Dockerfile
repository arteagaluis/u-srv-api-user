# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application code
COPY . .

# Definir variables de entorno
ENV NODE_ENV=production
ENV MONGO_URI_DOCKER=mongodb://mongo:27017/mydatabase
ENV BASE_PATH_PROD=https://dashboard.teliot.site

# Expose the port your app runs on
EXPOSE 4000

# Start the application
CMD ["node", "src/index.js"]

