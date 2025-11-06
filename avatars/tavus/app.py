#!/usr/bin/env python3
"""
Railway entrypoint for LiveKit Agent
This file allows Railway to detect and start the Python application
"""
# Import and run the LiveKit agent
# This file is in the same directory as tavus.py, so we can import directly
if __name__ == "__main__":
    # Import the entrypoint function from tavus module
    from tavus import entrypoint
    from livekit.agents import cli, WorkerOptions
    
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint
        )
    )

