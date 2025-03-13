# Air Quality API

This project provides a REST API to fetch air quality information from IQAir based on GPS coordinates and implements a cron job to track air quality in Paris.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- An IQAir API key (register at [https://www.iqair.com/fr/dashboard/api](https://www.iqair.com/fr/dashboard/api))
- A database (e.g., MongoDB, PostgreSQL, SQLite). In this example we use MongoDB.

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd air-quality-api
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file in the root directory and add your IQAir API key:**

    ```env
    API_KEY=YOUR_IQ_AIR_API_KEY
    PORT=YOUR_LOCAL_HOST_PORT
    DB_NAME=YOUR_DB_NAME
    DB_USER=YOUR_DATABASE_USER
    DB_PASSWORD=YOUR_DATABASE_PASSWORD
    DB_HOST=YOUR_DATABASE_HOST
    ```

## Running the API

```bash
npm start
```

## Running all tests

```bash
npm test:all
```

## Run just the integration test

```bash
npm test:integration
```

## Run just the unit tests

```bash
npm test:unit
```
