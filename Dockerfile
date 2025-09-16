# Use Node 18 as base (since your package.json says node ^18)
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy only package.json & package-lock.json first (for caching layer)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app code
COPY . .

# Expose port (Render.com or Compose will map it)
EXPOSE 3000

# Default command
CMD ["npm", "start"]
