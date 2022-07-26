cd IcdAnnotation.API
dotnet publish -c Release
Compress-Archive -Path bin/Release/net6.0/publish -DestinationPath ../IcdAnnotation.API.zip -Force
cd ../icd-annotation-frontend
npm run build
Compress-Archive -Path build -DestinationPath ../IcdAnnotation.Frontend.zip -Force
cd ..

scp -i ~/.ssh/nuc-webserver IcdAnnotation.*.zip doctorstodo@192.168.178.73:~
ssh -i ~/.ssh/nuc-webserver doctorstodo@192.168.178.73 "./deploy_icd-annotation.sh"
