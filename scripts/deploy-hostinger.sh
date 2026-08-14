#!/bin/bash
set -e

echo "=== 1. Building Next.js standalone ==="
./node_modules/.bin/next build

echo "=== 2. Preparing standalone package ==="
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

echo "=== 3. Creating archive ==="
tar -czf standalone.tar.gz -C .next/standalone .

echo "=== 4. Uploading to Hostinger ==="
expect -c "
set timeout 300
spawn scp -P 65002 -o StrictHostKeyChecking=no standalone.tar.gz u989720899@86.38.243.142:/home/u989720899/domains/mindrythm.com/hbuilds/standalone.tar.gz
expect \"*assword*\"
sleep 0.5
send \"Salvator@1234\r\"
expect eof
"

echo "=== 5. Extracting and reloading on Hostinger ==="
expect -c "
set timeout 120
spawn ssh -o StrictHostKeyChecking=no -p 65002 u989720899@86.38.243.142
expect \"*assword*\"
sleep 0.5
send \"Salvator@1234\r\"
expect \"$ \"
send \"tar -xzf ~/domains/mindrythm.com/hbuilds/standalone.tar.gz -C ~/domains/mindrythm.com/hbuilds/current/nodejs/ && rm -f ~/domains/mindrythm.com/hbuilds/standalone.tar.gz && find ~/domains/mindrythm.com/hbuilds/current/nodejs/ -name '._*' -delete && mkdir -p ~/domains/mindrythm.com/hbuilds/current/nodejs/tmp && touch ~/domains/mindrythm.com/hbuilds/current/nodejs/tmp/restart.txt && echo '===HOSTINGER_DEPLOY_COMPLETE==='\r\"
expect \"===HOSTINGER_DEPLOY_COMPLETE===\"
expect \"$ \"
send \"exit\r\"
expect eof
"

rm -f standalone.tar.gz
echo "=== Hostinger deployment finished successfully! ==="
