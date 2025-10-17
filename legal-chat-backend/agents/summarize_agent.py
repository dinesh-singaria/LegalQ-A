from phidata_config.phidata_config import legal_agent

def run_summarize_agent(prompt: str, context: str) -> str:
    prompt_text = prompt.strip() if prompt else "Summarize the key points from the document."

    final_prompt = f"""{prompt_text}

Context:
{context}

Summary:"""

    result = legal_agent.run(final_prompt)

    # ✅ Safely extract text
    if hasattr(result, "content"):
        return result.content
    elif hasattr(result, "output"):
        return result.output
    elif isinstance(result, dict) and "content" in result:
        return result["content"]
    else:
        return str(result)