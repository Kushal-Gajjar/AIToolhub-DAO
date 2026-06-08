"""Grammar checking service using LanguageTool."""
import language_tool_python
from typing import List, Dict

_tool = None

def get_tool():
    global _tool
    if _tool is None:
        _tool = language_tool_python.LanguageTool("en-US")
    return _tool

async def check_grammar(text: str) -> List[Dict]:
    """Return a list of grammar/style issues with suggested corrections."""
    tool = get_tool()
    matches = tool.check(text)
    return [
        {
            "message": m.message,
            "offset": m.offset,
            "length": m.errorLength,
            "replacements": m.replacements[:3],
            "rule_id": m.ruleId,
            "category": m.category,
        }
        for m in matches
    ]
