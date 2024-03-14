import os
import paramiko
from io import StringIO

# Environment variables
sftp_server = os.environ['FTP_SERVER']
sftp_port = int(os.environ['FTP_PORT'])
sftp_username = os.environ['FTP_USERNAME']
sftp_password = os.environ['FTP_PASSWORD']
remote_path = '/updates/'

# Connect to the SFTP server
transport = paramiko.Transport((sftp_server, sftp_port))
transport.connect(username=sftp_username, password=sftp_password)
sftp = paramiko.SFTPClient.from_transport(transport)

# List all files in the remote directory
remote_files = sftp.listdir(remote_path)

# List all files in the current GitHub repository
local_files = set(os.listdir('.'))

# Delete files that are in the remote directory but not in the GitHub repository
for file in remote_files:
    if file not in local_files:
        sftp.remove(os.path.join(remote_path, file))
        print(f"Deleted: {file}")

# Cleanup
sftp.close()
transport.close()
