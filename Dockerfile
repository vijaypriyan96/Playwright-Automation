# Use the official Playwright Docker image as the base.
# Replace 'v1.xx.x-noble' with the version appropriate for your needs.
FROM mcr.microsoft.com/playwright:v1.56.1-noble

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock/pnpm-lock.yaml)
# This is a common practice to take advantage of Docker layer caching.
COPY package*.json ./

# Install project dependencies
# Note: Playwright itself and the browsers are already installed in the base image.
RUN npm ci

# Copy the rest of your Playwright project files
COPY . .

# Use the bash shell as the ENTRYPOINT. This lets you run any command
# (npx, npm, etc.) when you call 'docker run'.
ENTRYPOINT [ "/bin/bash", "-c" ]

# Set a default command to run if no command is provided (optional)
# This will run your default Playwright tests if you just call 'docker run <image>'.
CMD [ "npx playwright test SpecFiles/expandTestingPractice.spec.ts --grep \"Dia\" " ]