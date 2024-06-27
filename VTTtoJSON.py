import webvtt
import json
from datetime import datetime
import re

def parse_time(timeStr):
    return datetime.strptime(timeStr, "%H:%M:%S.%f")

VC = re.compile('[aeiou]+[^aeiou]+', re.I)
def count_syllables(word):
    return len(VC.findall(word))

def flesch_kincaid(text):
    num_words = len(text.split())
    num_sentences = len(re.findall("\?|\.", text)) + 1
    num_syllables = sum(count_syllables(w) for w in text.split())
    fk = (0.39 * num_words / num_sentences) + (11.8 * num_syllables / num_words) - 15.59
    fk = max(fk, 0)
    fk = min(fk, 12)
    return str(int(fk))

name = "the_chase"
filename = f"./public/{name}/{name}.vtt"
jsonObj = json.loads('{"captions": []}')

for element in webvtt.read(filename, encoding="utf-8"):
    start_time = parse_time(element.start)
    end_time = parse_time(element.end)
    duration = (end_time - start_time).total_seconds()
    text = element.text.replace("\u00a0\n", " ").replace("\u2019", "'").replace("\n", " ").replace("  ", " ")
    re.sub('<[^>]+>', '', text)
    caption = {
        "start": element.start,
        "end": element.end,
        "text": text,
        "flesch_kincaid": flesch_kincaid(element.text),
        "duration": duration,
        "ttsDuration": 0 # placeholder
    }
    jsonObj["captions"].append(caption)

with open(filename.replace("vtt", "json"), "w") as file:
    json.dump(jsonObj, file, indent=4)