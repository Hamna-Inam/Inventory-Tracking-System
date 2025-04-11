# Use Node.js LTS version as the base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Install TypeScript globally
RUN npm install -g typescript ts-node

# Expose the port your app runs on
EXPOSE 3000

# Use the dev script that runs both processes
CMD ["npm", "run", "dev"] 