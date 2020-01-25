from mongoengine import Document, SortedListField, ReferenceField, StringField, IntField


class User(Document):
    username = StringField(required=True, max_length=20, unique=True)
    hashed_password = StringField(required=True)


class UserStats(Document):
    username = StringField(required=True, max_length=20, unique=True)
    games_total = IntField(default=0)
    games_won = IntField(default=0)
    attacks = IntField(default=0)
    defends = IntField(default=0)


class Game(Document):
    players = SortedListField(ReferenceField(User))
