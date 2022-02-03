from django.template.loader import render_to_string
from django.views.generic import TemplateView

from game.models import Score


class Index(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super(Index, self).get_context_data(**kwargs)
        context['username'] = Score.score_by_request(request=self.request)

    @classmethod
    def end_game(cls, request):
        data = request.POST
        score = Score.score_by_request(request=request, username=data.get("username"))
        if score:
            if score.score < int(data.get('score')):
                score.score = int(data.get('score'))
                score.save()

        html = render_to_string("include/result.html", context={
            "score": Score.objects.all()
        })
