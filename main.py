from flask import Flask

app = Flask(__name__)


@app.route("/<country>/hazard/<hazard>/<admin_level>/")
def hazard_by_country_and_admin_level(country, hazard, admin_level):
    print(country)
    print(admin_level)
    print(hazard)
    return f"<p>Hello, MapAction! You are requesting information for {country} at admin level {admin_level}</p>"
