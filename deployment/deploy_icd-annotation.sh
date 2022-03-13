#!/bin/bash

unzip -q IcdAnnotation.API.zip
sudo cp /var/www/IcdAnnotation.API/appsettings.json /var/www/IcdAnnotation.API/appsettings.json.bak
sudo cp -R publish/* /var/www/IcdAnnotation.API/
sudo cp /var/www/IcdAnnotation.API/appsettings.json.bak /var/www/IcdAnnotation.API/appsettings.json
sudo rm -rf publish

unzip -q IcdAnnotation.Frontend.zip
sudo cp -R build/* /var/www/IcdAnnotation.Frontend/
sudo rm -rf build
rm -rf IcdAnnotation*.zip
sudo chmod 777 -R /var/www/IcdAnnotation*
sudo systemctl restart icd-annotation-api.service

