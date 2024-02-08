#!/usr/bin/env python3
"""A Basic Flask app
"""
from flask_babel import Babel
from flask import Flask, render_template, request


class Config:
    """Flask Babel configuration.
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)


@babel.localeselector
def get_locale() -> str:
    """
    This function determines the appropriate locale for a web page based
    on the user's preferred languages and the available languages configured
    in the application.
    Returns:
        str: The selected locale for the web page.
    """
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route('/')
def get_index() -> str:
    """Renders the home page.
    """
    return render_template('3-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
