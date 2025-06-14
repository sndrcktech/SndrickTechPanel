# plugins/s3_backup.py
import boto3
import os

def main(data):
    action = data.get("action", "backup")
    s3_url = data["s3_url"]    # endpoint URL (s3.amazonaws.com или http://minio:9000)
    bucket = data["bucket"]
    key = data["key"]
    aws_access = data["aws_access_key"]
    aws_secret = data["aws_secret_key"]
    file_path = data.get("file_path", "/backups/backup.tgz")

    s3 = boto3.client("s3", endpoint_url=s3_url,
                      aws_access_key_id=aws_access,
                      aws_secret_access_key=aws_secret)

    if action == "backup":
        s3.upload_file(file_path, bucket, key)
        return {"status": "ok", "msg": f"Backup {file_path} загружен в {bucket}/{key}"}
    elif action == "restore":
        s3.download_file(bucket, key, file_path)
        return {"status": "ok", "msg": f"Backup {bucket}/{key} восстановлен в {file_path}"}
    else:
        return {"status": "fail", "msg": "Неизвестное действие"}
