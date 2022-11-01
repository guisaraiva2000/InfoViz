import json


def get_county_from_city(killer):
    loc = killer["Location"].split(",")
    state = loc[-1].strip()
    if len(loc) == 1:
        return killer

    city = loc[-2].strip()
    county = ""
    for u in us:
        if u["city"] == city and u["state"] == state:
            county = u["county"]
    if county:
        killer["Location"] = county + ", " + state
    return killer


if __name__ == '__main__':
    killers_json = open('datasets/serial_killers.json', 'r', encoding='utf8')
    us_json = open('us_counties.json', 'r')

    us = json.load(us_json)
    killers = json.load(killers_json)

    result = list(map(get_county_from_city, killers))

    with open("FINAL_W_LOCATIONS.json", "w") as outfile:
        json.dump(result, outfile, indent=4)
