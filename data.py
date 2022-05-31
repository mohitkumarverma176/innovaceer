from flask import Blueprint, request, render_template
import dbops

data_blueprint = Blueprint('__data__', __name__)


@data_blueprint.route('/get_all_playlist')
def get_all_playlist():
    return dbops.get_playlist_data(request)


@data_blueprint.route('/create_playlist')
def create_playlist():
    return dbops.create_playlist(request)





