from fastapi import APIRouter
from app.api.api_v1.endpoints import users, auth
from app.api.api_v1.endpoints import stats
from app.api.api_v1.endpoints import services
from app.api.api_v1.endpoints import logs
from app.api.api_v1.endpoints import notify
from app.api.api_v1.endpoints import firewall
from app.api.api_v1.endpoints import backup
from app.api.api_v1.endpoints import mail
from app.api.api_v1.endpoints import dns
from app.api.api_v1.endpoints import audit
from app.api.api_v1.endpoints import rbac
from app.api.api_v1.endpoints import profile
from app.api.api_v1.endpoints import mfa
from app.api.api_v1.endpoints import ui
from app.api.api_v1.endpoints import theme
from app.api.api_v1.endpoints import prometheus
from app.api.api_v1.endpoints import ca
from app.api.api_v1.endpoints import vpn
from app.api.api_v1.endpoints import ldap as ldap_api
from app.api.api_v1.endpoints import metrics
from app.api.api_v1.endpoints import logs_advanced
from app.api.api_v1.endpoints import terminal
from app.api.api_v1.endpoints import backup2
from app.api.api_v1.endpoints import update
from app.api.api_v1.endpoints import antivirus
from app.api.api_v1.endpoints import agents
from app.api.api_v1.endpoints import push
from app.api.api_v1.endpoints import settings as settings_api
from app.api.api_v1.endpoints import dns
from app.api.api_v1.endpoints import webhooks
from app.api.api_v1.endpoints import rbac
from app.api.api_v1.endpoints import audit
from app.api.api_v1.endpoints import ca
from app.api.api_v1.endpoints import vpn
from app.api.api_v1.endpoints import mail_cert
from app.api.api_v1.endpoints import nginx_cert
from app.api.api_v1.endpoints import user_cert
from app.api.api_v1.endpoints import letsencrypt
from app.api.api_v1.endpoints import backup_audit
from app.api.api_v1.endpoints import cert_manager
from app.api.api_v1.endpoints import monitoring
from app.api.api_v1.endpoints import notifications
from app.api.api_v1.endpoints import webpush
from app.api.api_v1.endpoints import alert_matrix
from app.api.api_v1.endpoints import alert_matrix_rbac

from app.api.api_v1.endpoints import alert_templates


from app.api.api_v1.endpoints import alert_test_log



api_router = APIRouter()

api_router.include_router(alert_test_log.router, prefix="/alert_test_log", tags=["alert_test_log"])
api_router.include_router(alert_templates.router, prefix="/alert_templates", tags=["alert_templates"])
api_router.include_router(alert_matrix_rbac.router, prefix="/alert_matrix_rbac", tags=["alert_matrix_rbac"])
api_router.include_router(alert_matrix.router, prefix="/alert_matrix", tags=["alert_matrix"])
api_router.include_router(webpush.router, prefix="/webpush", tags=["webpush"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(monitoring.router, prefix="/monitoring", tags=["monitoring"])
api_router.include_router(backup_audit.router, prefix="/backup_audit", tags=["backup_audit"])
api_router.include_router(cert_manager.router, prefix="/cert_manager", tags=["cert_manager"])
api_router.include_router(letsencrypt.router, prefix="/letsencrypt", tags=["letsencrypt"])
api_router.include_router(user_cert.router, prefix="/user_cert", tags=["user_cert"])
api_router.include_router(nginx_cert.router, prefix="/nginx_cert", tags=["nginx_cert"])
api_router.include_router(mail_cert.router, prefix="/mail_cert", tags=["mail_cert"])
api_router.include_router(vpn.router, prefix="/vpn", tags=["vpn"])
api_router.include_router(ca.router, prefix="/ca", tags=["ca"])
api_router.include_router(audit.router, prefix="/audit", tags=["audit"])api_router.include_router(rbac.router, prefix="/rbac", tags=["rbac"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
api_router.include_router(dns.router, prefix="/dns", tags=["dns"])
api_router.include_router(settings_api.router, prefix="/settings", tags=["settings"])
api_router.include_router(push.router, prefix="/push", tags=["push"])
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
api_router.include_router(antivirus.router, prefix="/antivirus", tags=["antivirus"])
api_router.include_router(update.router, prefix="/update", tags=["update"])
api_router.include_router(backup2.router, prefix="/backup2", tags=["backup"])
api_router.include_router(terminal.router, prefix="/terminal", tags=["terminal"])
api_router.include_router(logs_advanced.router, prefix="/logs_adv", tags=["logs"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
api_router.include_router(ldap_api.router, prefix="/ldap", tags=["ldap"])
api_router.include_router(vpn.router, prefix="/vpn", tags=["vpn"])
api_router.include_router(auth.router, prefix="/login", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
api_router.include_router(services.router, prefix="/services", tags=["services"])
api_router.include_router(logs.router, prefix="/logs", tags=["logs"])
api_router.include_router(notify.router, prefix="/notify", tags=["notify"])
api_router.include_router(firewall.router, prefix="/firewall", tags=["firewall"])
api_router.include_router(firewall.router, prefix="/firewall", tags=["firewall"])
api_router.include_router(backup.router, prefix="/backup", tags=["backup"])
api_router.include_router(mail.router, prefix="/mail", tags=["mail"])
api_router.include_router(dns.router, prefix="/dns", tags=["dns"])
api_router.include_router(audit.router, prefix="/audit", tags=["audit"])
api_router.include_router(rbac.router, prefix="/rbac", tags=["rbac"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
api_router.include_router(mfa.router, prefix="/mfa", tags=["mfa"])
api_router.include_router(ui.router, prefix="/ui", tags=["ui"])
api_router.include_router(theme.router, prefix="/theme", tags=["theme"])
api_router.include_router(prometheus.router, prefix="/prometheus", tags=["prometheus"])
api_router.include_router(ca.router, prefix="/ca", tags=["ca"])


