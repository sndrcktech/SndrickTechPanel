from fastapi import APIRouter, Depends, HTTPException
from app.api import deps
from typing import List
import os

import CloudFlare

router = APIRouter()

CF_EMAIL = os.environ.get("CF_EMAIL")
CF_TOKEN = os.environ.get("CF_TOKEN")

def get_cf():
    return CloudFlare.CloudFlare(email=CF_EMAIL, token=CF_TOKEN)

@router.get("/zones")
def list_zones(current_user=Depends(deps.get_current_active_superuser)):
    cf = get_cf()
    return cf.zones.get()

@router.get("/records")
def list_records(zone_id: str, current_user=Depends(deps.get_current_active_superuser)):
    cf = get_cf()
    return cf.zones.dns_records.get(zone_id)

@router.post("/add")
def add_record(
    zone_id: str,
    type: str,
    name: str,
    content: str,
    current_user=Depends(deps.get_current_active_superuser),
):
    cf = get_cf()
    rec = {
        "type": type.upper(),
        "name": name,
        "content": content,
        "ttl": 120,
        "proxied": False,
    }
    cf.zones.dns_records.post(zone_id, data=rec)
    return {"ok": True}

@router.post("/delete")
def delete_record(zone_id: str, record_id: str, current_user=Depends(deps.get_current_active_superuser)):
    cf = get_cf()
    cf.zones.dns_records.delete(zone_id, record_id)
    return {"ok": True}
