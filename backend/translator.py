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

# Fix encoding issues on Windows
if sys.platform.startswith('win'):
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.detach())

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

    - Preserves meaning, tone, punctuation, and Markdown formatting
    - Removes all emojis from the translation
    - If input already appears to be in target language, rewrites naturally
    """

    system_content = (
        f"You are a professional translator. Translate the user's message into {target_language}.\n"
        f"CRITICAL: Return ONLY the translated text. Do not add explanations, notes, or commentary.\n"
        f"Preserve meaning, tone, punctuation, and Markdown formatting.\n"
        f"Remove all emojis from the translation - do not include any emojis in your response.\n"
        f"If the input is already in {target_language}, provide a natural {target_language} rewrite.\n"
        f"Your response must contain only the translation, nothing else."
    )

    glossary_text = glossary or ""
    human_content = f"GLOSSARY (optional):\n{glossary_text}\n\nTEXT:\n{text}"

    chat = _build_chat()

    messages = [
        SystemMessage(content=system_content),
        HumanMessage(content=human_content),
    ]

    resp = chat(messages)
    result = getattr(resp, "content", str(resp))
    
    # Clean up the response - remove any extra commentary
    lines = result.strip().split('\n')
    # Take only the first line that looks like actual translation content
    # (not explanatory text in parentheses)
    clean_result = ""
    for line in lines:
        line = line.strip()
        # Skip lines that are clearly commentary
        if (line.startswith('(') and line.endswith(')')) or \
           line.startswith('GLOSSARY:') or \
           line.startswith('(Emoji:') or \
           line.startswith('(Markdown') or \
           line.startswith('(Code blocks') or \
           line.startswith('(If the input'):
            continue
        # Take the first substantial line as the translation
        if line and not line.startswith('('):
            clean_result = line
            break
    
    # If we didn't find a clean result, return the original first line
    return clean_result if clean_result else lines[0].strip()


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
