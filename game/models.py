from django.db import models

from django.conf import settings
from django.utils.crypto import get_random_string


class Score(models.Model):
    username = models.CharField(max_length=210, verbose_name="Имя", unique=True)
    score = models.IntegerField("Счет", default=0)

    session = models.CharField("Сессия", max_length=130)

    class Meta:
        ordering = ["-id"]
        verbose_name = "Результат"
        verbose_name_plural = "Результаты"

    def __str__(self):
        return f"#{self.id} {self.username}  {self.score}"

    @classmethod
    def get_score(cls, session=None, username=None):
        """
          Метод получения результата на основе  уникального ключа.
        """
        score_instance = None

        if session:
            score_instance = cls.objects.filter(session=session).first()

        if not score_instance and username:
            if not session:
                session = get_random_string(length=32).upper()
            try:
                item = cls.objects.get(username=username)
                name = username + f"({len(cls.objects.filter(username=username))})"
                score_instance = cls.objects.create(session=session, username=name)
            except cls.DoesNotExist:
                score_instance = cls.objects.create(session=session, username=username)

        return score_instance

    @classmethod
    def score_by_request(cls, request, username: str = None):
        """
          Получение результата из request
        """
        session_key = request.COOKIES.get(settings.SESSION_COOKIE_NAME, None)
        if not session_key and not request.session.exists(request.session.session_key):
            request.session.create()
            session_key = request.session.session_key

        score = cls.get_score(session=session_key, username=username)

        return score
