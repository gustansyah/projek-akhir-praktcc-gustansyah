FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Expose port 8080 (required by Cloud Run)
EXPOSE 8080

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Start application
CMD ["npm", "start"]