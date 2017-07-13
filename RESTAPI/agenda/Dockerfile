FROM alpine:3.5

ENV BUILD_PACKAGES postgresql-dev build-base pkgconfig postgresql-client vim

RUN apk add --no-cache python python-dev nginx && \
    python -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip install --upgrade pip setuptools && \
    rm -r /root/.cache && \
    rm -f /etc/nginx/conf.d/*

RUN mkdir -p /var/interlegis/agenda && \
    apk add --update --no-cache $BUILD_PACKAGES && \
    mkdir -p /var/interlegis/agenda/static

WORKDIR /var/interlegis/agenda

ADD . /var/interlegis/agenda

COPY start.sh /var/interlegis/agenda/
COPY config/nginx/agenda.conf /etc/nginx/conf.d
COPY config/nginx/nginx.conf /etc/nginx/nginx.conf

RUN pip install -r /var/interlegis/agenda/requirements/dev-requirements.txt --upgrade setuptools && \
    rm -r /root/.cache

RUN python manage.py collectstatic --noinput

RUN chmod +x /var/interlegis/agenda/start.sh && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

VOLUME ["/var/interlegis/agenda/data", "/var/interlegis/agenda/media"]

CMD ["/var/interlegis/agenda/start.sh"]
