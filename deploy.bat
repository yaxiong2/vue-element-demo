@echo off
plink boss@10.14.3.244 -pw PWD_244 "cd /home/boss/venus_deploy/venus-x;ls -al"
call yarn build
plink boss@10.14.3.244 -pw PWD_244 "cd /home/boss/venus_deploy/venus-x;rm -rf dist_old;mv dist dist_old"
pscp -l boss -pw PWD_244 -r ./dist 10.14.3.244:/home/boss/venus_deploy/venus-x/
plink boss@10.14.3.244 -pw PWD_244 "cd /home/boss/venus_deploy/venus-x;ls -al"
pause
