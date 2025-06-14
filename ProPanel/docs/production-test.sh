#!/bin/bash
# Тестирует, что панель после установки реально отвечает и swap работает

set -e
URL="https://127.0.0.1"
ROLE="web"
VDS_ID="v1"

echo "== Проверка health =="
curl -k "$URL/health"

echo "== Применение роли $ROLE к $VDS_ID =="
curl -sk -X POST "$URL/api/topology/applyrole" -d '{"vds_id": "'"$VDS_ID"'", "role": "'"$ROLE"'"}' -H 'Content-Type: application/json'

echo "== Вызов swap/резерва =="
curl -sk -X POST "$URL/api/topology/swap" -d '{"primary_id": "'"$VDS_ID"'", "reserve_id": "v2"}' -H 'Content-Type: application/json'

echo "== Проверка отчёта по swap =="
curl -sk "$URL/api/reports/failover"
