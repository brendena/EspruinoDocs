const { execSync } = require('child_process');
const fs = require('fs');
const fse = require('fs-extra'); 
const path = require('path');
const markdownFiles = require("./commenter").markdownFiles;

const DIR= process.cwd();
const website = "~/workspace/espruinowebsite";

const mdirList = [
    website,
    `${website}/www/img`,
    `${website}/www/scripts`,
    "html/refimages", 
    "html/boards",
    "html/img",
];

mdirList.forEach(function (item) {
    console.log(item)
    fs.mkdirSync(item, { recursive: true });
});

const rmList = [
    "html/*.html",
    "html/*.js",
    "html/refimages/*",
    "html/boards/*"
];
rmList.forEach(function (item) {
    execSync("rm -f " + item );
});

markdownFiles();

const listOfBoard = ["PICO_R1_3", "ESPRUINOBOARD", "ESP8266_BOARD", "MICROBIT2", "ESPRUINOWIFI", "PUCKJS", "PIXLJS", "ESP32", "WIO_LTE", "MDBT42Q", "THINGY52", "NRF52832DK", "STM32L496GDISCOVERY", "RAK8211", "RAK8212", "RAK5010"];

process.chdir('../Espruino');
listOfBoard.forEach(function (BOARDNAME) {           
    execSync(`python scripts/build_board_docs.py ${BOARDNAME} pinout` );
    fs.renameSync(`boards/${BOARDNAME}.html`, `${DIR}/html/boards/${BOARDNAME}.html`);
    try{
        execSync(`cp boards/img/${BOARDNAME}.* ${website}/www/img`);
        execSync(`cp boards/img/${BOARDNAME}.* ${DIR}/html/img`);
    }
    catch(err){
        console.warn(`${BOARDNAME} doesn't exit`);
    } 
});
fse.copySync('boards/img/PUCKJS_2.jpg', `${DIR}/html/img/PUCKJS_2.jpg`);
fse.copySync('boards/img/PUCKJS_LITE.jpg', `${DIR}/html/img/PUCKJS_LITE.jpg`);

execSync(`python scripts/build_docs.py` );

process.chdir(DIR);

console.log("Getting file modification times...");

exec(`git ls-tree -r --name-only HEAD | xargs -I{} git log -1 --format="%at {}" -- {} | sort > ordering.txt`);
fs.appendFileSync('ordering.txt', '2000000000 tutorials/Bangle.js Getting Started.md\n');
fs.appendFileSync('ordering.txt', '2000000000 tutorials/Bangle.js Development.md\n');
//execSync(`git ls-tree -r --name-only HEAD | xargs -I{} git log -1 --format="%at {}" -- {} | sort > ordering.txt` );

//------------------------
//So here is where i need to get the node code devided up


/*
// Equivalent to mkdir -p
fs.mkdirSync(item, { recursive: true });

// Equivalent to rm -f
try {
    fs.unlinkSync('my/file/path');
} catch (err) {
    // Handle error
}

// Equivalent to cp
fse.copySync('source/file/path', 'destination/file/path');
*/