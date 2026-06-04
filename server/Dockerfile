FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Expose the API port
EXPOSE 5001

CMD ["npm", "start"]
