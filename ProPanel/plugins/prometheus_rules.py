# plugins/prometheus_rules.py

def main(data):
    rule_name = data.get("rule_name")
    expr = data.get("expr")
    duration = data.get("for", "1m")
    severity = data.get("severity", "critical")
    alert_rule = {
        "groups": [
            {
                "name": "sandrick_panel_alerts",
                "rules": [
                    {
                        "alert": rule_name,
                        "expr": expr,
                        "for": duration,
                        "labels": {"severity": severity},
                        "annotations": {"summary": f"Сработал алерт: {rule_name}"}
                    }
                ]
            }
        ]
    }
    # Реализовать: отправку на API Prometheus, либо обновление правил на диске + reload
    return {"status": "ok", "rule": alert_rule}
