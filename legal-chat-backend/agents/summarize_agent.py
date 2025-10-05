from phidata_config.phidata_config import legal_agent

def run_summarize_agent(prompt: str, context: str) -> str:
    prompt_text = prompt.strip() if prompt else "Summarize the key points from the document."

    final_prompt = f"""{prompt_text}

Context:
{context}

Summary:"""

    return legal_agent.chat(final_prompt)