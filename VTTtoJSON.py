import webvtt
import json
import math
from readability import Readability
from datetime import datetime

def parse_time(timeStr):
    return datetime.strptime(timeStr, "%H:%M:%S.%f")

def flesch_kincaid(text):
    num_words = len(text.split())
    mult = math.ceil(100/num_words) + 1
    calcText = f"{text.replace("\n", " ")}. ".replace("..",".") * mult
    r = Readability(calcText)
    fk = r.flesch_kincaid()
    return fk.grade_level

filename = "./public/university_challenge/university_challenge.vtt"
jsonObj = json.loads('{"captions": []}')

for element in webvtt.read(filename, encoding="utf-8"):
    start_time = parse_time(element.start)
    end_time = parse_time(element.end)
    duration = (end_time - start_time).total_seconds()
    caption = {
        "start": element.start,
        "end": element.end,
        "text": element.text.replace("\u00a0\n", " ").replace("\u2019", "'").replace("\n", " ").replace("  ", " "),
        "flesch_kincaid": flesch_kincaid(element.text),
        "duration": duration,
        "ttsDuration": 0 # placeholder
    }
    jsonObj["captions"].append(caption)

with open(filename.replace("vtt", "json"), "w") as file:
    json.dump(jsonObj, file, indent=4)