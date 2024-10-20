from typing import Any
import numpy as np
import pycountry
from pathlib import Path

import rasterio
import rasterio.mask
import geopandas as gpd
from markupsafe import Markup

from flask import Flask, request
from rasterio.windows import from_bounds

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
    country_data = [
        {"name": country.name,
         "iso_3": country.alpha_3,
         "available_admin_levels": 3}
        for country in pycountry.countries
    ]
    return Markup(country_data)


@app.route("/population/")
def read_popn():
    dataset = rasterio.open('../data/lbn_ppp_2020.tif')
    shp_file_path = "../data/lebanon-draft-01.json"
    gdf = gpd.read_file(shp_file_path)
    output = {}
    grand_total_population = 0
    for feature in gdf.iterfeatures():
        image, out_transform = rasterio.mask.mask(dataset,
                                                  [feature['geometry']],
                                                  crop=True)
        # Define no data value
        no_data_value = -9.9999000e+04
        # Mask the array to exclude the no data value
        masked_array = image[image != no_data_value]
        # Calculate the sum of the values excluding the no data value
        total_sum = np.sum(masked_array)
        output[feature['properties']['admin2Name']] = round(total_sum)
        grand_total_population += total_sum
    print(f"{grand_total_population=}")
    return Markup(output)
