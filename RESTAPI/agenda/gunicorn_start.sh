#!/bin/bash

# As seen in http://tutos.readthedocs.org/en/latest/source/ndg.html

AGENDA_DIR="/var/interlegis/agenda/agenda"

# Seta um novo diretório foi passado como raiz para o AGNEDA
# caso esse tenha sido passado como parâmetro
if [ "$1" ]
then
    AGENDA_DIR="$1"
fi

NAME="AGENDA"                                     # Name of the application (*)
DJANGODIR=/var/interlegis/agenda/                    # Django project directory (*)
SOCKFILE=/var/interlegis/agenda/run/gunicorn.sock    # we will communicate using this unix socket (*)
USER=`whoami`                                   # the user to run as (*)
GROUP=`whoami`                                  # the group to run as (*)
NUM_WORKERS=9                                   # how many worker processes should Gunicorn spawn (*)
                                                # NUM_WORKERS = 2 * CPUS + 1
DJANGO_SETTINGS_MODULE=agenda.settings            # which settings file should Django use (*)
DJANGO_WSGI_MODULE=agenda.wsgi                    # WSGI module name (*)

echo "Starting $NAME as `whoami` on base dir $SAPL_DIR"

# parameter can be passed to run without virtualenv
if [[ "$@" != "no-venv" ]]; then
    # Activate the virtual environment
    cd $DJANGODIR
    source /var/interlegis/.virtualenvs/agenda/bin/activate
    export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
    export PYTHONPATH=$DJANGODIR:$PYTHONPATH
fi

# Create the run directory if it doesn't exist
RUNDIR=$(dirname $SOCKFILE)
test -d $RUNDIR || mkdir -p $RUNDIR

# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
exec gunicorn ${DJANGO_WSGI_MODULE}:application \
  --name $NAME \
  --workers $NUM_WORKERS \
  --user $USER \
  --bind=unix:$SOCKFILE
