cd JanKIS.API
dotnet publish -c Release
Compress-Archive -Path bin/Release/net5.0/publish -DestinationPath ../JanKIS.API.zip
cd ../jankis-frontend
npm run build
Compress-Archive -Path build -DestinationPath ../JanKIS.Frontend.zip
cd ..

scp -i ~/.ssh/nuc-webserver JanKIS.*.zip doctorstodo@192.168.178.73:~
ssh -i ~/.ssh/nuc-webserver doctorstodo@192.168.178.73 "./deploy_jankis.sh"
