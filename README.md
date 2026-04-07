# Workforce Activity Analytics

A backend analytics tool that processes operational shift data to identify the most active workplaces based on completed shifts.

## Overview
This project aggregates workplace activity data from a backend API and computes top-performing workplaces by analyzing completed shifts. It simulates a real-world staffing analytics pipeline used to derive operational insights.

## Features
- Fetches data from REST APIs (`/workplaces`, `/shifts`)
- Handles paginated API responses
- Filters completed shifts using business logic
- Aggregates and ranks workplaces by activity
- Outputs top-performing workplaces in structured JSON

## Tech Stack
- TypeScript
- Node.js
- NestJS (backend API)
- Prisma ORM
- SQLite

## How to Run

### Start backend server
```bash
cd server
npm install
npx prisma generate
npm run start:dev
```

Run analytics script
```bash
npm run start:topWorkplaces
```
Example Output
```bash
[
  { "name": "Earth Ecology Enterprises", "shifts": 5 },
  { "name": "Saturn Systems", "shifts": 3 },
  { "name": "Venus Ventures", "shifts": 2 }
]
```
Business Impact

This tool demonstrates how operational data can be transformed into actionable insights, enabling organizations to identify high-performing workplaces and optimize workforce allocation.

