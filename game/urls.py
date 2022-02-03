from django.urls import path

from game.views import Index

app_name = "game"

urlpatterns = [
    path("", Index.as_view(), name="index"),
]
