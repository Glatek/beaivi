echo 'Building JavaScript'
npx esbuild index.js --minify --sourcemap --outfile=pkg/index.js

echo 'Moving package.json'
cp package.json pkg/package.json
