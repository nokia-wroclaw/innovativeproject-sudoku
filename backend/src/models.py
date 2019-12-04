from mongoengine import StringField, BooleanField, Document


class User(Document):
    username = StringField(required=True, max_length=200)
    email = StringField(required=True, max_length=200)
    hashed_password = StringField(required=True, max_length=200)
    disabled = BooleanField(default=False)
