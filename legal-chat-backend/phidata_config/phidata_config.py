from phidata.app.ai.gemini import GeminiApp
from phidata.app.group import AppGroup

# Setup Gemini app
legal_agent = GeminiApp(
    name="legal_agent",
    model="gemini-1.5-flash-latest",
    system_message="You are a helpful legal assistant for understanding documents and answering questions.",
)

# Add to group
legal_apps = AppGroup(apps=[legal_agent])