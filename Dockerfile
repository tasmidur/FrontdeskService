# Use the latest stable Node.js image as a base
FROM node:current-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Copy the .env file to the container (make sure it's in the root of your project directory)
COPY .env .env

# Generate the Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production environment
FROM node:current-alpine

WORKDIR /app

# Copy only the production dependencies and the built code from the previous stage
COPY package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Copy the .env file for production
COPY .env .env

# Expose the port your application will use (optional if defined in .env)
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/src/main"]
