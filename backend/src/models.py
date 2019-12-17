from mongoengine import StringField, BooleanField, Document


class User(Document):
    username = StringField(required=True, max_length=200, unique=True)
    email = StringField(required=True, max_length=200, unique=True)
    hashed_password = StringField(required=True, max_length=200)
    disabled = BooleanField(default=False)
