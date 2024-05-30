import webvtt
import json
import math
from readability import Readability


def flesch_kincaid(text):
    num_words = len(text.split())
    mult = math.ceil(100/num_words)
    calcText = f"{text.replace("\n", "")}. ".replace("..",".") * mult
    r = Readability(calcText)
    fk = r.flesch_kincaid()
    return fk.grade_level

filename = "./public/BBC_Space/BBC_Space.vtt"
jsonObj = json.loads('{"captions": []}')

for element in webvtt.read(filename, encoding="utf-8"):
    caption = {
        "start": element.start,
        "end": element.end,
        "text": element.text.replace("\u00a0\n", " ").replace("\u2019", "'").replace("  ", " "),
        "flesch_kincaid": flesch_kincaid(element.text)
    }
    jsonObj["captions"].append(caption)

with open(filename.replace("vtt", "json"), "w") as file:
    json.dump(jsonObj, file, indent=4)