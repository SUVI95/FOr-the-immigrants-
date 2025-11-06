#!/bin/bash
# Start the Tavus avatar agent with all required environment variables

cd "$(dirname "$0")/../.." || exit 1
source venv/bin/activate

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Start the agent
cd avatars/tavus
python tavus.py dev

