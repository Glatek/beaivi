echo 'Publishing package to NPM'
npm version patch
npm run build
cd pkg
npm publish
cd ../
