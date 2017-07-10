FROM alpine:3.5

RUN apk add --update --no-cache python3 nginx nodejs && \
    rm -f /etc/nginx/conf.d/*

RUN mkdir -p /var/interlegis/frontend/agenda

WORKDIR /var/interlegis/frontend/agenda

ADD . /var/interlegis/frontend/agenda

COPY config/nginx/agenda.conf /etc/nginx/conf.d
COPY config/nginx/nginx.conf /etc/nginx/nginx.conf

RUN cd /var/interlegis/frontend/agenda && npm install && npm run deploy

RUN chmod +x /var/interlegis/frontend/agenda/start.sh && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

CMD ["/var/interlegis/frontend/agenda/start.sh"]
