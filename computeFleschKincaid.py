import json
from readability import Readability
import math
import re

VC = re.compile('[aeiou]+[^aeiou]+', re.I)
def count_syllables(word):
    return len(VC.findall(word))

def flesch_kincaid(text):
    num_words = len(text.split())
    num_sentences = len(re.findall("\?|\.", text)) + 1
    num_syllables = sum(count_syllables(w) for w in text.split())
    fk = (0.39 * num_words / num_sentences) + (11.8 * num_syllables / num_words) - 15.59
    fk = max(fk, 0)
    return str(int(fk))

def write_json_file(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

def clean_text(text):
    return text.replace("\u00a0\n", " ").replace("\u2019", "'").replace("\n", " ").replace("  ", " ")

filename = "./public/university_challenge/university_challenge.json"
# filename = "./public/bbc_space/bbc_space.json"
with open(filename, 'r', encoding="utf-8") as file:
    data = json.load(file)

captions_with_fk = []
for element in data["captions"]:
    cleaned_text = clean_text(element["text"])
    caption = {
        "start": element["start"],
        "end": element["end"],  # Fixed typo from element["start"] to element["end"]
        "text": cleaned_text,
        "flesch_kincaid": flesch_kincaid(cleaned_text),
        "tts_duration": element["tts_duration"]
    }
    captions_with_fk.append(caption)

data["captions"] = captions_with_fk
write_json_file(data, filename.replace(".json", "_FK.json"))
