from database import mongo
import os
import json
from flask import jsonify
import requests
import config


def get_playlist_data(request):
    url = "https://shazam.p.rapidapi.com/search"
    params = {
        'term': 'kiss the rain', 'locale': 'en-US', 'offset': '0'
    }
    headers = {
        'X-RapidAPI-Host': 'shazam.p.rapidapi.com',
        'X-RapidAPI-Key': 'be94e43f7fmsh6795cb60be3ac98p10f6bdjsn345106b7f1a5'
    }
    response = requests.get(url, params=params, headers=headers)
    data = json.loads(response.text)
    print(json.dumps(data, indent=2))
    return jsonify({'status': 'success', 'data': data})


def create_playlist(request):
    req_json = request.json
    track_name = req_json['track_name']
    update_query = {
        '$set': {
            'user_id': req_json['user_id'],
            'track_name': track_name
        }
    }
    mongo.db[config.USER_PLAYLIST].update_one({'user_id': req_json['user_id']}, update_query, upsert=True)
    return jsonify({
        'status': 'success',
        'message': 'song added to playlist'
    })
