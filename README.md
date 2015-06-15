# HiddenTreasure
Building location based game for mobile web browser
## Instructions
If you would like to download the code and try it for yourself:
  1. Clone the repo: https://github.com/JouniIkonen/HiddenTreasure.git
  2. Install packages: npm install
  3. Change out the database configuration in config/database.js
  4. Change out all the url "http://ct100020vir6.pc.lut.fi:1072" to "http://localhost:8080" in each file (assuming that you are running webserver in localhost in port 8080)
  5. Change out "app.listen(1072)" (in server.js) to "app.listen(8080)"
  6. Launch: node server.js
  7. Visit in your web browser at: http://localhost:8080
