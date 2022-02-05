# -*- coding: utf-8 -*-
import os, sys
sys.path.insert(0, '/var/www/u1584067/data/doodle-game')
sys.path.insert(1, '/var/www/u1584067/data/doodle-game/env/lib/python3.8/site-packages')
os.environ['DJANGO_SETTINGS_MODULE'] = 'base_template.settings'
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
