#!/bin/bash
set -e
VDS_IP="$1"
ROLE="$2"
curl -X PUT http://$VDS_IP:5454/api/role -H 'Content-Type: application/json' -d '{"role": "'"$ROLE"'"}'
curl http://$VDS_IP:5454/api/docker -H 'Content-Type: application/json' -d '{"cmd": "ls", "args": {}}'
