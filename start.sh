#!/bin/bash

echo "Starting GrokTunes.ai..."
echo ""
echo "1. Starting Cloudflare Workers API..."
cd workers && npm run dev &
WORKERS_PID=$!

echo "2. Starting React Frontend..."
cd .. && npm run dev &
FRONTEND_PID=$!

echo ""
echo "GrokTunes.ai is starting..."
echo "Frontend: http://localhost:5173"
echo "API: http://localhost:8787"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap "kill $WORKERS_PID $FRONTEND_PID; exit" INT
wait