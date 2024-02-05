import requests
from django.http import HttpResponse
from django.template import engines


def catchall_dev(request, upstream="http://localhost:3000"):
    """
    !!! Only use this for local development purposes!!!

    Proxy all requests to another upstream URL. Requests for HTML assets are served normally; requests for any other
    asset types (images for example) are served in a streaming fashion to help with big files.
    This can be used in conjunction with a catchall route (e.g "re_path(r'', catchall_dev)" to redirect request for
    a UI to a NodeJS development server running locally on another port (to benefit from hot-code reloading for example).

    In production, the UI should be served alongside the backend by the same
    python webserver (e.g gunicorn)

    Source: https://fractalideas.com/blog/making-react-and-django-play-well-together-hybrid-app-model/
    """
    upstream_url = upstream + request.path
    response = requests.get(upstream_url)

    content_type = response.headers.get("Content-Type")

    if content_type == "text/html; charset=UTF-8":
        response_text = response.text
        content = engines["django"].from_string(response_text).render()
    else:
        content = response.content

    return HttpResponse(
        content,
        content_type=content_type,
        status=response.status_code,
        reason=response.reason,
    )
