import pycountry
from flask import Flask
from pathlib import Path

from markupsafe import Markup

from flask import Flask, request

app = Flask(__name__)


@app.route("/<country>/hazard/<hazard>/<admin_level>/")
def hazard_by_country_and_admin_level(country, hazard, admin_level):
    file_format = request.args.get("format", type=str)
    print(country)
    print(admin_level)
    print(hazard)
    print(file_format)

    if file_format == "csv":
        file_name = "lebanon-draft-01.csv"
    elif file_format == "geojson":
        file_name = "lebanon-draft-01.json"
    else:
        return f"<p>Hello, MapAction! You are requesting information for {country} at admin level {admin_level}.</p>"

    file_path = Path(__file__).parent.parent / "data" / file_name
    with open(file_path, encoding="utf8") as f:
        data = f.read()
    return Markup(data)


@app.route("/countries/")
def country_list():
    country_data = [(country.name, country.alpha_3) for country in
                    pycountry.countries]
    return country_data
