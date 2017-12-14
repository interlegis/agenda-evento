#!/bin/sh
if [ $(docker inspect -f '{{.State.Running}}' agendaevento_agendadb_1) = "true" ] && [ $(docker inspect -f '{{.State.Running}}' agendaevento_agenda_frontend_1) = "true" ] && [ $(docker inspect -f '{{.State.Running}}' agendaevento_agenda_backend_1) = "true" ]; then
  echo "Test passed"
  exit 0
else
  echo "Test failed"
  exit 1
fi
