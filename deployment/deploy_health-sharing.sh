#!/bin/bash

unzip -q HealthSharingPortal.API.zip
sudo cp /var/www/HealthSharingPortal.API/appsettings.json /var/www/HealthSharingPortal.API/appsettings.json.bak
sudo cp -R publish/* /var/www/HealthSharingPortal.API/
sudo cp /var/www/HealthSharingPortal.API/appsettings.json.bak /var/www/HealthSharingPortal.API/appsettings.json
sudo rm -rf publish

unzip -q HealthSharingPortal.Frontend.zip
sudo cp -R build/* /var/www/HealthSharingPortal.Frontend/
sudo rm -rf build
rm -rf HealthSharingPortal*.zip
sudo chmod 777 -R /var/www/HealthSharingPortal
sudo chmod 777 -R /var/www/HealthSharingPortal*
sudo systemctl restart health-sharing-api.service


