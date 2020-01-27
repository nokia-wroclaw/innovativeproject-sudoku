from mongoengine import (
    Document,
    StringField,
    IntField,
    FloatField,
)


class User(Document):
    username = StringField(required=True, max_length=20, unique=True)
    hashed_password = StringField(required=True)


class UserStats(Document):
    username = StringField(required=True, max_length=20, unique=True)
    games_total = IntField(default=0)
    games_won = IntField(default=0)
    attacks = IntField(default=0)
    heals = IntField(default=0)
    time_spend = FloatField(default=0)
