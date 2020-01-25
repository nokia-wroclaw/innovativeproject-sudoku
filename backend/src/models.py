from mongoengine import Document, SortedListField, ReferenceField, StringField


class User(Document):
    username = StringField(required=True, max_length=20, unique=True)
    hashed_password = StringField(required=True)


class Game(Document):
    players = SortedListField(ReferenceField(User))
