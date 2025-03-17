echo "./package.json" > temp/dump.txt
cat package.json >> temp/dump.txt

echo "./vite.config.mjs" >> temp/dump.txt
cat vite.config.mjs >> temp/dump.txt

echo "./index.html" >> temp/dump.txt
cat index.html >> temp/dump.txt

echo "\n\n./src/main.js" >> temp/dump.txt
cat src/main.js >> temp/dump.txt

echo "\n\n./src/App.vue" >> temp/dump.txt
cat src/App.vue >> temp/dump.txt

cat temp/dump.txt | xclip -selection clipboard
