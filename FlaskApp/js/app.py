from flask import Flask, jsonify
from sqlalchemy import create_engine, func
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base
import sqlalchemy
import numpy as np

engine = create_engine("sqlite:///stuff.db")
# reflect an existing database into a new model
Base = automap_base()
# make sure that I have a primary key or else this won't work
# reflect the tables
Base.prepare(engine, reflect=True)
# Save reference to the table
ethnicity = Base.classes.nickdb
# Create our session (link) from Python to the DB
session = Session(engine)
#################################################
# Flask Setup
#################################################
app = Flask(__name__)
#################################################
# Flask Routes
#################################################
@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/names<br/>"
        f"/api/v1.0/passengers"
    )
    # this is the syntax I want to use to call API stuff


@app.route("/states")
def names():
    """Return a list of all State abbreviations"""
    # Query all passengers
    results = session.query(ethnicity.STATE).all()
    # Convert list of tuples into normal list
    all_names = list(np.ravel(results))
    return jsonify(all_names)


if __name__ == '__main__':
    app.run(debug=True)
