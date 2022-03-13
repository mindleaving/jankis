cd HealthSharingPortal.API
dotnet publish -c Release
Compress-Archive -Path bin/Release/net5.0/publish -DestinationPath ../HealthSharingPortal.API.zip -Force
cd ../health-sharing-portal
npm run build
Compress-Archive -Path build -DestinationPath ../HealthSharingPortal.Frontend.zip -Force
cd ..

scp -i ~/.ssh/nuc-webserver HealthSharingPortal.*.zip doctorstodo@192.168.178.73:~
ssh -i ~/.ssh/nuc-webserver doctorstodo@192.168.178.73 "./deploy_health-sharing.sh"
