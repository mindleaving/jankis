#!/bin/bash

unzip -q JanKIS.API.zip
sudo cp /var/www/JanKIS.API/appsettings.json /var/www/JanKIS.API/appsettings.json.bak
sudo cp -R publish/* /var/www/JanKIS.API/
sudo cp /var/www/JanKIS.API/appsettings.json.bak /var/www/JanKIS.API/appsettings.json
sudo rm -rf publish

unzip -q JanKIS.Frontend.zip
sudo cp -R build/* /var/www/JanKIS.Frontend/
sudo rm -rf build
rm -rf JanKIS*.zip
sudo chmod 777 -R /var/www/JanKIS*
sudo systemctl restart jankis-api.service


