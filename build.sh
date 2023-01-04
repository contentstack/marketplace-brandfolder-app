# build command format is
# bash build.sh <uiUrl>
# example commands:
# bash build.sh https://dev-brandfolder.contentstackmarket.com
# bash build.sh https://stag-brandfolder.contentstackmarket.com
# bash build.sh https://brandfolder.contentstackmarket.com

set -e
#The above command is to fail build if any one of the below build steps fail

rm -rf to-deploy
mkdir to-deploy

#UI Build
cd ui
rm -rf build
rm -rf node_modules
npm install
# npm run test
npm run precommit
npm run build
cd rte
updateRTEConfigFile() {
	if [ "$1" == "" ]
		then
			echo "Missing UI URL input parameter"
			exit $1
	fi
	rm -rf .newEnv
	sed '/^REACT_APP_UI_URL/d' .env > .newEnv
	echo -e "REACT_APP_UI_URL=$1" >> .newEnv
	rm -rf .env
	mv .newEnv .env
}
updateRTEConfigFile $1
npm install
npm run build
cd ..
zip -r ui.zip build/
mv ui.zip ../to-deploy
cd ..