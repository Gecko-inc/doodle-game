import json

from django.http import JsonResponse
from django.template.loader import render_to_string
from django.views.generic import TemplateView

from game.models import Score


class Index(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super(Index, self).get_context_data(**kwargs)
        context['username'] = Score.score_by_request(request=self.request)

        return context

    @classmethod
    def end_game(cls, request):
        data = json.loads(request.body.decode())
        username = data.get("username") if data.get("username") else 'unknown'
        score = Score.score_by_request(request=request, username=username)
        # print(score.username)
        if score:
            if score.score < int(data.get('score')):
                score.score = int(data.get('score'))
                score.save()
        html = render_to_string("include/result.html", {
            "score": Score.objects.all(),
        })
        return JsonResponse(
            {
                'html': html
            }
        )
