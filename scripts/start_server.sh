
#!/bin/bash

# add permision to folder
sudo chmod -R 777 /var/www/mindmint-api

# Go to app folder
cd /var/www/mindmint-api

# start again
echo "start all services"
pm2 start all