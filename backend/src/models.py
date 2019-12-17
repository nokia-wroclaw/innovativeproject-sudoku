from mongoengine import StringField, BooleanField, EmailField, Document


class User(Document):
    username = StringField(required=True, max_length=200, unique=True)
    email = EmailField(required=True, max_length=200, unique=True)
    hashed_password = StringField(required=True, max_length=200)
    disabled = BooleanField(default=False)
