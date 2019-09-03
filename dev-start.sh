#!/bin/sh
#
#This script serves the purpose of check and configure local environment, 
#as well as automatically start the development instance
#

#check brew is installed
BREW_STATUS=`brew config|grep HOMEBREW_VERSION|wc -l`
if [ $BREW_STATUS -eq 0 ]; then
	echo "brew has not been installed, now installing..."
	/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
	brew update
fi


#check node is installed
NODE_STATUS=`node -v|wc -l`
if [ $NODE_STATUS -eq 0 ]; then
	echo "node has not been installed, now installing..."
	brew install node
fi

#check npm is installed
NPM_STATUS=`npm -v|wc -l`
if [ $NPM_STATUS -eq 0 ]; then
	echo "npm has not been installed, now installing..."
	brew install npm
fi

#check nodemon is installed
NODEMON_STATUS=`npm list nodemon|grep nodemon|wc -l`
if [ $NODEMON_STATUS -eq 0 ]; then
	echo "nodemon has not been installed, now installing..."
	npm install nodemon
fi

#check the .env file
DEV_STATUS=`cat .env|grep "NODE_ENV=development"|wc -l`
if [ $DEV_STATUS -eq 0 ]; then
	sed -i.bak "s/NODE_ENV=.*/NODE_ENV=development/g" .env
fi

MONGO_URI_STATUS=`cat .env|grep ^MONGO_URI|wc -l`
if [ $MONGO_URI_STATUS -ne 0 ]; then
	sed -i.bak "s/MONGO_URI=.*/#&/g" .env
fi
rm -rf .env.bak

#check ttab is installed
TTAB_STATUS=`npm list g ttab|grep ttab|wc -l`
if [ $TTAB_STATUS -eq 0 ]; then 
	echo "ttab has not been installed, now installing..."
	npm install ttab
fi

#check the mongod is running in another terminal tab

MONGO_STATUS=`ps -ef|grep mongod|grep -v "grep"|wc -l`
MONGO_PATH=`brew info mongodb|grep "files"|awk '{print $1}'`
if [ $MONGO_STATUS -eq 0 ]; then
	ttab eval "cd $MONGO_PATH/bin;./mongod"
fi

#create directory for logger
LOG_DIR_STATUS=`ls -l logs|wc -l`
if [ $LOG_DIR_STATUS -ne 1 ]; then
	mkdir -p logs
fi
INFO_LOG_STATUS=`ls -l logs/info.log|wc -l`
if [ $INFO_LOG_STATUS -ne 1 ]; then
	touch logs/info.log
fi
SERVER_LOG_STATUS=`ls -l logs/server.log|wc -l`
if [ $SERVER_LOG_STATUS -ne 1 ]; then
	touch logs/server.log
fi
ERROR_LOG_STATUS=`ls -l logs/error.log|wc -l`
if [ $ERROR_LOG_STATUS -ne 1 ]; then
	touch logs/error.log
fi

#run local enviroment
NPM_STATUS=`npm list babel-core|grep babel|wc -l`
if [ $NPM_STATUS -eq 0 ]; then
	npm install
fi
npm start

