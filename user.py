from datetime import timedelta
from flask import flash, Blueprint, redirect, render_template, url_for, request
from flask_login import UserMixin, login_user, logout_user, current_user, LoginManager
import config
from database import mongo


class User(UserMixin):
    def __init__(self, email_id, remember=False):
        self.id = email_id
        self.remember = remember

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def is_authenticated(self):
        return True


def check_user_credentials(form_data):
    result = mongo.db[config.USERS_COLLECTION].find_one({'email': form_data['email']})

    if result is None:
        flash('User does not exist')
        return False

    remember = True if 'remember' in form_data and form_data['remember'] else False

    login_user(User(form_data['email'], remember=remember), remember=remember, duration=timedelta(days=7))

    return True


def load_user_obj(email_id):
    result = mongo.db[config.USERS_COLLECTION].find_one(
        {'email': email_id})
    if result is not None:
        return User(email_id)


login_blueprint = Blueprint('login', __name__)

login_manager = LoginManager()
login_manager.login_view = 'login.login'


@login_blueprint.route('/login', methods=['GET'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    return render_template('login.html')


@login_blueprint.route('/login', methods=['POST'])
def login_post():
    if not check_user_credentials(request.form):
        return redirect(url_for('login.login'))

    return redirect(url_for('index'))


@login_blueprint.route('/logout')
def logout():
    logout_user()

    return redirect(url_for('index'))


@login_manager.user_loader
def load_user(email_id):
    return load_user_obj(email_id)
