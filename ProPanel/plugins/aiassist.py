# plugins/aiassist.py

def main(data):
    question = data.get("question")
    # Здесь можно интегрировать внешнее LLM или свой стек best-practices
    # Для MVP: на основе roles/policies/guides генерируем советы
    if "CA" in question:
        return {"status": "ok", "answer": "Рекомендуется делать двухуровневую CA, корень держать offline, минимум 2 intermediate, все private ключи защищать HSM/KMS/Vault."}
    if "backup" in question:
        return {"status": "ok", "answer": "Backup делайте ежедневно, храните offsite, проверяйте регулярное восстановление, шифруйте в покое и на передаче."}
    return {"status": "ok", "answer": "Используйте автоматическое резервирование, 2FA, MFA и резервные роли для повышения надёжности."}
