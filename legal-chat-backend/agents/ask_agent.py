from phidata_config.phidata_config import legal_agent

def run_ask_agent(question: str, context: str) -> str:
    prompt = f"""You are a legal assistant. Based on the context below, answer the user's question.

Context:
{context}

Question:
{question}

Answer:"""

    # Get the raw response object
    response = legal_agent.run(prompt)

    # Extract just the text content
    if isinstance(response, dict) and "content" in response:
        return response["content"].strip()
    elif hasattr(response, "content"):   # if it's an object with a .content attribute
        return response.content.strip()
    else:
        return str(response)