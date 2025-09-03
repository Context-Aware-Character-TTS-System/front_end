# === Stage 1: Build ===
# Use an official Node.js runtime as a parent image for the build stage.
# Using a specific version (e.g., 20-alpine) ensures consistency.
FROM node:20-alpine AS builder

# Set the working directory in the container.
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first.
# This leverages Docker's layer caching. These files don't change often,
# so 'npm install' will only run again if they do.
COPY package*.json ./

# Install project dependencies.
RUN npm install

# Copy the rest of the application's source code.
# This is done after npm install, so changes to code don't invalidate the dependency cache.
COPY . .

# Build the Next.js application for production.
# This command creates an optimized build in the .next folder.
RUN npm run build

# === Stage 2: Production ===
# Use a small, secure base image for the final production container.
FROM node:20-alpine AS runner

# Set the working directory.
WORKDIR /app

# Set the environment to production.
# This disables development-only features and optimizes Next.js.
ENV NODE_ENV=production

# Create a non-root user and group for security purposes.
# Running as a non-root user is a security best practice.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the necessary production dependencies definitions.
COPY package*.json ./

# Install only production dependencies.
RUN npm install --production

# Copy the built application from the 'builder' stage.
# This includes the .next folder which contains the optimized code.
COPY --from=builder /app/.next ./.next

# Copy the public assets.
COPY --from=builder /app/public ./public

# Change the ownership of the app files to the non-root user.
RUN chown -R nextjs:nodejs /app

# Switch to the non-root user.
USER nextjs

# Expose the port the app runs on.
# The default Next.js port is 3000.
EXPOSE 3000

# The command to run when the container starts.
# 'npm start' will run the 'next start' command defined in package.json.
CMD ["npm", "start"]