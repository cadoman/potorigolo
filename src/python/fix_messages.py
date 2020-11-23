from ftfy import fix_text

def fix_message(message) :
    return fix_object(message)
def fix_object(obj):
    if isinstance(obj, dict):
        return { key:fix_object(value) for key, value in obj.items()}
    elif isinstance(obj, str):
        return fix_text(obj)
    elif isinstance(obj, list):
        return [fix_object(element) for element in obj]
    elif isinstance(obj, set):
        return set(fix_object(o) for o in obj)
    else:
        return obj
