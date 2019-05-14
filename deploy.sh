#!/bin/bash

tar czf api.tar.gz src/ package.json
scp -i LightsailDefaultKey-ap-south-1.pem api.tar.gz ubuntu@13.127.142.124:~

rm api.tar.gz

ssh -i LightsailDefaultKey-ap-south-1.pem ubuntu@13.127.142.124 << 'ENDSSH'
pm2 stop API
rm -r api/node_modules api/package.json api/package-lock.json api/src
tar xf api.tar.gz -C api/
rm api.tar.gz
cd api
npm install
pm2 start API
ENDSSH