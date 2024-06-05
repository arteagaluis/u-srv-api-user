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


# Expose the port your app runs on
EXPOSE 3001

# Start the application
CMD ["node", "src/index.js"]

