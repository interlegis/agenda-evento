#!/bin/sh

create_env() {
    echo "[ENV FILE] creating .env file..."
    # check if file exists
    if [ -f "/var/interlegis/agenda/data/secret.key" ]; then
        KEY=`cat /var/interlegis/agenda/data/secret.key`
    else
        KEY=`python genkey.py`
        echo $KEY > data/secret.key
    fi

    FILENAME="/var/interlegis/agenda/agenda/.env"

    if [ -z "${DATABASE_URL:-}" ]; then
        DATABASE_URL="postgresql://agenda:agenda@agendadb:5432/agenda"
    fi

    # ALWAYS replace the content of .env variable
    # If want to conditionally create only if absent then use IF below
    #    if [ ! -f $FILENAME ]; then

    touch $FILENAME
    # explicitly use '>' to erase any previous content
    echo "SECRET_KEY="$KEY > $FILENAME
    # now only appends
    echo "DATABASE_URL = ""$DATABASE_URL" >> $FILENAME
    echo "DEBUG = ""${DEBUG-False}" >> $FILENAME
    echo "EMAIL_USE_TLS = ""${USE_TLS-True}" >> $FILENAME
    echo "EMAIL_PORT = ""${EMAIL_PORT-587}" >> $FILENAME
    echo "EMAIL_HOST = ""${EMAIL_HOST-''}" >> $FILENAME
    echo "EMAIL_HOST_USER = ""${EMAIL_HOST_USER-''}" >> $FILENAME
    echo "EMAIL_HOST_PASSWORD = ""${EMAIL_HOST_PASSWORD-''}" >> $FILENAME
    echo "EMAIL_SEND_USER = ""${EMAIL_HOST_USER-''}" >> $FILENAME
    echo "DEFAULT_FROM_EMAIL = ""${EMAIL_HOST_USER-''}" >> $FILENAME
    echo "SERVER_EMAIL = ""${EMAIL_HOST_USER-''}" >> $FILENAME

    echo "[ENV FILE] done."
}

create_env

#python3 manage.py bower install

/bin/sh busy-wait.sh $DATABASE_URL

pwd
python manage.py migrate --noinput
echo "Adding Cronjobs."
python manage.py crontab add
echo "Cronjobs added."

/bin/sh gunicorn_start.sh no-venv &
/usr/sbin/nginx -g "daemon off;"
