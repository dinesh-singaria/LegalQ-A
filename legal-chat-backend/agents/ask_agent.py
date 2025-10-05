from phidata_config.phidata_config import legal_agent

def run_ask_agent(question: str, context: str) -> str:
    prompt = f"""You are a legal assistant. Based on the context below, answer the user's question.

Context:
{context}

Question:
{question}

Answer:"""

    return legal_agent.chat(prompt)