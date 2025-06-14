# plugins/ldap_master.py
import ldap3

def main(data):
    ldap_uri = data["ldap_uri"]
    bind_dn = data["bind_dn"]
    bind_pass = data["bind_pass"]
    action = data["action"]  # "add_user", "add_server", "add_group"
    entry = data["entry"]    # dict: cn, sn, mail, role, server, etc.

    server = ldap3.Server(ldap_uri)
    conn = ldap3.Connection(server, bind_dn, bind_pass, auto_bind=True)

    if action == "add_user":
        dn = f"uid={entry['uid']},ou=Users,dc=example,dc=org"
        attrs = {
            'objectClass': ['inetOrgPerson'],
            'sn': entry['sn'],
            'cn': entry['cn'],
            'mail': entry['mail'],
            'userPassword': entry['password'],
        }
        conn.add(dn, attributes=attrs)
        return {"status": "ok", "msg": f"User {entry['cn']} добавлен в LDAP"}
    elif action == "add_server":
        dn = f"cn={entry['cn']},ou=Servers,dc=example,dc=org"
        attrs = {'objectClass': ['device'], 'cn': entry['cn'], 'ipHostNumber': entry['ip']}
        conn.add(dn, attributes=attrs)
        return {"status": "ok", "msg": f"Server {entry['cn']} добавлен в LDAP"}
    elif action == "add_group":
        dn = f"cn={entry['cn']},ou=Groups,dc=example,dc=org"
        attrs = {'objectClass': ['groupOfNames'], 'cn': entry['cn'], 'member': entry['members']}
        conn.add(dn, attributes=attrs)
        return {"status": "ok", "msg": f"Group {entry['cn']} добавлена в LDAP"}
    else:
        return {"status": "fail", "msg": "Неизвестное действие"}
