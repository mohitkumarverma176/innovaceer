from flask import Flask, render_template
import config
from database import mongo
import config
from data import data_blueprint
import dbops
from user import login_blueprint, login_manager
from flask_login import login_required

app = Flask(__name__)

app.config['SECRET_KEY'] = config.SECRET_KEY

mongo.init_app(app, uri=config.MONGODB_URI)

login_manager.init_app(app)

app.register_blueprint(data_blueprint)
app.register_blueprint(login_blueprint)


@app.route('/')
@login_required
def index():
    return render_template('index.html', page="reports")


if __name__ == '__main__':
    # dbops.get_playlist_data()
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)