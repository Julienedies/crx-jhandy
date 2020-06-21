/**
 * 为项目生成要发布的zip，chrome web store要求；
 * Created by j on 2019-08-17.
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const pkg = require('../package.json');

const projectDir = path.resolve(__dirname, '../');

let output = fs.createWriteStream(`${ projectDir }/${ pkg.name }.zip`);
let archive = archiver('zip', {
    zlib: {level: 9}
});

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

output.on('end', function () {
    console.log('Data has been drained');
});

archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.log(err)
    } else {
        // throw error
        throw err;
    }
});

archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);


archive.file(path.resolve(projectDir, 'manifest.json'), {name: 'manifest.json'});

archive.directory('dist/');

archive.directory('assets/');

//archive.glob(path.join(projectDir, 'assets/**'));

archive.finalize();
