# Lighthouse CI Server - Disk Space Management

## Overview

This document explains how to handle disk space issues when the Lighthouse
CI server database runs out of space on an AWS EC2 instance.

## Prerequisites

- SSH access to the EC2 instance
- Sudo privileges
- Basic understanding of Linux commands

## Symptoms of Disk Space Issues

- Lighthouse CI server fails to start or crashes
- Database operations fail with "disk full" errors
- High disk usage shown in `df -h` output
- Docker container stops responding

## Step-by-Step Resolution

### 1. Check Current Disk Usage

First, verify the current disk space situation:

```bash
# Check disk usage
df -h

# Check block device information
lsblk

# Check Docker volume usage
docker volume list
docker volume inspect lhci-data
```

### 2. Expand EBS Volume in AWS Console

1. Navigate to the AWS EC2 Console
2. Go to **Volumes** section
3. Select the EBS volume attached to your instance
4. Take a snapshot as a backup
5. Select the EBS volume attached to your instance & cick **Actions** →
   **Modify Volume**
6. Increase the size as needed (e.g., from 8GB to 12GB)
7. Wait for the modification to complete (status changes to "optimising" then "completed")

### 3. Extend Partition and Filesystem

Once the EBS volume modification is complete, connect to your instance and
extend the partition and filesystem:

```bash
# Connect to your EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Switch to root user
sudo su

# Check current block device layout
lsblk

# Extend the partition (replace xvda1 with your actual partition)
# Note: Use the device name without the partition number
# Note the space in between the partition number and device name
sudo growpart /dev/xvda 1

# Verify partition extension
lsblk

# Extend the filesystem
# For XFS filesystems:
sudo xfs_growfs /

# For Ext4 filesystems:
sudo resize2fs /dev/xvda1

# Verify the extension
df -h
```

### 4. Restart Docker Services

After extending the filesystem, you may need to restart Docker services
to ensure they recognise the new space:

```bash
# Restart Docker service
sudo systemctl restart docker

# Check Docker container status
docker ps -a

# Restart Lighthouse CI container if needed
docker restart inspiring_lumiere  # Replace with your container name
```

### 5. Verify Lighthouse CI Server

Check that the Lighthouse CI server is working properly:

```bash
# Check container logs
docker logs inspiring_lumiere

# Test server connectivity
curl http://localhost:9001/version

# Check database access (if needed)
docker exec -it inspiring_lumiere bash

# Inside container:
# apt-get install sqlite3  # If not already installed
# sqlite3 /data/db.sql
# .tables
# .quit
```

## Troubleshooting

### Common Issues

1. **"No space left on device" error during growpart**

   - Free up some disk space before running growpart
   - Remove unnecessary files or Docker images

2. **Partition already at maximum size**

   - Verify the EBS volume modification completed successfully
   - Check AWS console for volume status

3. **Filesystem extension fails**
   - Ensure you're using the correct filesystem type (XFS vs Ext4)
   - Check that the partition was extended successfully

### Verification Commands

```bash
# Check filesystem type
df -hT

# Verify partition and volume sizes match
lsblk

# Check Docker volume mount point
docker volume inspect lhci-data

# Monitor disk usage
watch -n 5 'df -h'
```

## Prevention

To prevent future disk space issues:

1. **Monitor disk usage regularly**

   ```bash
   # Set up disk monitoring
   df -h | grep -E '^/dev/'
   ```

2. **Clean up Docker resources periodically**

   ```bash
   # Remove unused Docker images
   docker image prune -a

   # Remove unused Docker volumes
   docker volume prune
   ```

3. **Set up CloudWatch alarms** for disk usage metrics

4. **Consider automated volume scaling** based on usage patterns

## References

- [AWS EBS Volume Expansion Guide](https://docs.aws.amazon.com/ebs/latest/userguide/recognize-expanded-volume-linux.html)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Docker Volume Management](https://docs.docker.com/storage/volumes/)

## Support

If you encounter issues not covered in this guide:

1. Check AWS CloudWatch logs for system-level errors
2. Review Docker container logs for application-specific issues
3. Contact your system administrator or DevOps team
4. Consider creating a support ticket with AWS if EBS-related issues persist
