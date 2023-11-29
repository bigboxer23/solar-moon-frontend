#!/usr/bin/env bash
host=blah.com
user=ec2-user
destination=blah.com

echo Deploying to $destination
rm -rf build
npm run build
aws s3 sync ./build s3://$destination
#scp -i "~/.ssh/Core.pem" -r ./build $user@$host:/var/www/$destination/html-stage
#ssh -i "~/.ssh/Core.pem" -t $user@$host -o StrictHostKeyChecking=no "rm -rf /var/www/$destination/html-prev; mv /var/www/$destination/html /var/www/$destination/html-prev;mv /var/www/$destination/html-stage /var/www/$destination/html"
