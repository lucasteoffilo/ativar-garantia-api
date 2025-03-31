pm2 kill
npm run build
cp .env.stage.dev dist/
STAGE=dev pm2 start dist/main.js --time
pm2 startup
sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v16.14.2/bin /home/ubuntu/.nvm/versions/node/v16.14.2/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 restart app
pm2 log