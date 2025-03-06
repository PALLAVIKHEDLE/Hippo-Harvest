# Hippo Harvest Frontend Engineer Interview

Thanks for investing the time into completing a project for our Frontend Engineer opening.

## Requirments

It’s the year 2028, and your task is to build a temperature control system for Hippo’s nationwide network of production facilities, which are distributed around the United States. The system is a relatively simple one, that lets the facilities coordinator view some aspects of the weather at each location, and set the target temperature for that facility.

The goals for this project are to demonstrate your ability to:

- Interact with a backend API
- Display data and support interactions around that data
- Design an intuitive UI that supports your target use cases

The task is reasonably open ended, and we invite you to imagine what exactly those use cases may be. Here are a few examples:

- A user may want to group facilities that have similar weather at the current time, and adjust them in tandem
- A user may want to sort facilities by different criteria
- A user may want to the ability to make a coarse adjustment that effects everything, and then make individual finer adjustments
- A user may want to add a new facility, or consider a particular site for expansion

Your solution need not be exhaustive; the goal is instead to articulate a few target use cases, and talk through the process of how you built a system that supports those use cases.

## Getting Started

### Installation

Install nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Install the latest version of node:

```bash
nvm install --lts
nvm use --lts
```

Install the dependencies:

```bash
npm ci
```

### Add Api Key

Create a .env file in the in this directory.

```bash
# ./.env
VITE_REACT_APP_OPENWEATHERMAP_API_KEY=<paste-api-key-here>
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build into a docker image:

```bash
./build_and_run.sh
```

You can review the production build at <http://localhost:3000>
