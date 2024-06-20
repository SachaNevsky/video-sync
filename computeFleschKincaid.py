import json
from readability import Readability
import math

def flesch_kincaid(text):
    num_words = len(text.split())
    mult = math.ceil(100/num_words) + 1
    calcText = f"{text.replace("\n", " ")}. ".replace("..",".") * mult
    r = Readability(calcText)
    fk = r.flesch_kincaid()
    return fk.grade_level

def write_json_file(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

def clean_text(text):
    return text.replace("\u00a0\n", " ").replace("\u2019", "'").replace("\n", " ").replace("  ", " ")

filename = "./public/university_challenge/university_challenge.json"
with open(filename, 'r', encoding="utf-8") as file:
    data = json.load(file)

captions_with_fk = []
for element in data["captions"]:
    cleaned_text = clean_text(element["text"])
    caption = {
        "start": element["start"],
        "end": element["end"],  # Fixed typo from element["start"] to element["end"]
        "text": cleaned_text,
        "flesch_kincaid": flesch_kincaid(cleaned_text)
    }
    captions_with_fk.append(caption)

data["captions"] = captions_with_fk
write_json_file(data, filename.replace(".json", "_FK.json"))