import os
from dotenv import load_dotenv
from phi.agent import Agent
from phi.model.google import Gemini


# Load environment variables from .env file
load_dotenv()

# Get the Gemini API key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Validate
if not GOOGLE_API_KEY:
    raise ValueError("❌ GOOGLE_API_KEY is not set in .env")

# Setup Gemini app
legal_agent = Agent(
    name="legal_agent",
    model=Gemini(id="gemini-2.0-flash"),
    system_prompt="You are a helpful legal assistant for understanding documents and answering questions.",
)