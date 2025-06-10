FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port 8080 (required by Cloud Run)
EXPOSE 8080

# Start the app
CMD ["serve", "-s", "build", "-l", "8080"]