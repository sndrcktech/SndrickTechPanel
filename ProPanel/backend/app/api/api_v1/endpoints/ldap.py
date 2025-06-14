import ldap
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from app.api import deps
import os

router = APIRouter()

LDAP_URI = os.environ.get("LDAP_URI", "ldap://127.0.0.1")
BASE_DN = os.environ.get("LDAP_BASE_DN", "dc=example,dc=com")
ADMIN_DN = os.environ.get("LDAP_ADMIN_DN", "cn=admin,dc=example,dc=com")
ADMIN_PW = os.environ.get("LDAP_ADMIN_PW", "admin")

def get_ldap_conn():
    l = ldap.initialize(LDAP_URI)
    l.simple_bind_s(ADMIN_DN, ADMIN_PW)
    return l

class LdapUser(BaseModel):
    uid: str
    cn: str
    sn: str
    userPassword: str

class LdapGroup(BaseModel):
    cn: str

@router.get("/users", response_model=List[str])
def list_ldap_users(current_user=Depends(deps.get_current_active_superuser)):
    l = get_ldap_conn()
    res = l.search_s(BASE_DN, ldap.SCOPE_SUBTREE, "(objectClass=posixAccount)")
    return [entry[1]["uid"][0].decode() for entry in res]

@router.post("/users")
def add_ldap_user(user: LdapUser, current_user=Depends(deps.get_current_active_superuser)):
    l = get_ldap_conn()
    dn = f"uid={user.uid},ou=users,{BASE_DN}"
    attrs = [
        ('objectClass', [b'inetOrgPerson', b'posixAccount', b'top']),
        ('uid', [user.uid.encode()]),
        ('sn', [user.sn.encode()]),
        ('cn', [user.cn.encode()]),
        ('userPassword', [user.userPassword.encode()]),
        ('uidNumber', [b'10000']), # автонумерация — реализовать!
        ('gidNumber', [b'10000']),
        ('homeDirectory', [f"/home/{user.uid}".encode()])
    ]
    l.add_s(dn, attrs)
    return {"added": user.uid}

@router.get("/groups", response_model=List[str])
def list_ldap_groups(current_user=Depends(deps.get_current_active_superuser)):
    l = get_ldap_conn()
    res = l.search_s(BASE_DN, ldap.SCOPE_SUBTREE, "(objectClass=posixGroup)")
    return [entry[1]["cn"][0].decode() for entry in res]

@router.post("/groups")
def add_ldap_group(group: LdapGroup, current_user=Depends(deps.get_current_active_superuser)):
    l = get_ldap_conn()
    dn = f"cn={group.cn},ou=groups,{BASE_DN}"
    attrs = [
        ('objectClass', [b'posixGroup', b'top']),
        ('cn', [group.cn.encode()]),
        ('gidNumber', [b'10000']) # автонумерация — реализовать!
    ]
    l.add_s(dn, attrs)
    return {"added": group.cn}

@router.post("/groups/adduser")
def add_user_to_group(group: str, uid: str, current_user=Depends(deps.get_current_active_superuser)):
    l = get_ldap_conn()
    group_dn = f"cn={group},ou=groups,{BASE_DN}"
    l.modify_s(group_dn, [(ldap.MOD_ADD, 'memberUid', uid.encode())])
    return {"status": f"{uid} добавлен в {group}"}
