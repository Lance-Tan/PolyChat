import os
import sys
from dotenv import load_dotenv

from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from langchain.schema import HumanMessage, SystemMessage

load_dotenv()

# Build the ChatOpenAI client exactly like your template
def _build_chat():
    return ChatOpenAI(
        openai_api_base=os.getenv("BASE_URL", "https://api.ai.it.ufl.edu"),
        openai_api_key=os.getenv("API_KEY"),
        model=os.getenv("MODEL", "mistral-7b-instruct"),
        temperature=float(os.getenv("LLM_TEMPERATURE", "0.0")),
    )

def translate_message(
    text: str,
    target_language: str,
    *,
    glossary: str | None = None,
) -> str:
    """
    Translate `text` into `target_language` using an OpenAI-compatible endpoint.

    - Preserves meaning, tone, emojis, and Markdown
    - Keeps code blocks verbatim
    - If input already appears to be in target language, rewrites naturally
    - `glossary` can be a newline list like:
        Heart failure=Insuficiencia cardiaca
        Stroke=Accidente cerebrovascular
    """

    system_content = (
        "You are a professional translator. Translate the user's message into "
        f"{target_language} that is easy for the user to read.\n"
        "Preserve meaning, tone, emojis, punctuation, and any Markdown formatting.\n"
        "Preserve code blocks verbatim. Do not add commentary—return only the translation.\n"
        f"If the input already appears to be in {target_language}, return a clear, natural rewrite in {target_language}."
    )

    glossary_text = glossary or ""
    human_content = f"GLOSSARY (optional):\n{glossary_text}\n\nTEXT:\n{text}"

    chat = _build_chat()

    messages = [
        SystemMessage(content=system_content),
        HumanMessage(content=human_content),
    ]

    resp = chat(messages)
    return getattr(resp, "content", str(resp))


def main():
    """Command-line interface for the translator."""
    # Get text and target language from environment variables
    text = os.getenv("TEXT")
    target_language = os.getenv("TARGET_LANGUAGE")
    
    if not text or not target_language:
        print("Error: TEXT and TARGET_LANGUAGE environment variables are required", file=sys.stderr)
        sys.exit(1)
    
    try:
        # Get optional system prompt from environment
        system_prompt = os.getenv("LLM_SYSTEM_PROMPT")
        
        # Translate the text
        result = translate_message(text, target_language, glossary=system_prompt)
        print(result)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
