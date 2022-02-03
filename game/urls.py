from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from game.views import Index

app_name = "game"

urlpatterns = [
    path("", Index.as_view(), name="index"),
    path("score/", csrf_exempt(Index.end_game), name="end_game"),
]
