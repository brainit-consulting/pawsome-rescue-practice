# Pawsome Mobile Grooming: a stuck app to rescue

This is the practice app for **Agentic Builders, course 2: Rescue a Stuck App** (BrainIT Consulting). It looks and
works like a booking app made with an AI app builder, and it's stuck in the ways those apps often get stuck.

**It's deliberately broken. Don't use it for a real business.**

## What's wrong with it (the course fixes each one)

1. Customers can't finish a booking: the last step never lets them confirm.
2. Anyone can read every customer's name, phone number and address.
3. A secret key is written into the code that runs in every visitor's browser.

`npm test` shows these as failing tests until they're fixed.

## Run it

You need [Node.js](https://nodejs.org) 22 or later. In this folder:

```
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:8080; if something else uses that port, Vite picks the next one). Until you connect your own Supabase project (course 2, lesson 7), the app runs on
built-in sample data.
