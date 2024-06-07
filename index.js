const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = './WebP';
const INPUT_DIR = './Images';

// Removes all content from a directory
const removeDirRecursive = (dirPath) => {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                removeDirRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dirPath);
    }
};

// Create directory if not exist
const createDirIfNotExist = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
};

// Convert image to WebP
const convertToWebp = (inputPath, outputPath) => {
    sharp(inputPath)
        .webp()
        .toFile(outputPath);
};

// Traverse directory recursively and convert images
const traverseAndConvert = (dir) => {
    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            const subdir = path.join(OUTPUT_DIR, path.relative(INPUT_DIR, filePath));
            createDirIfNotExist(subdir);
            traverseAndConvert(filePath);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
                const imgName = path.parse(file).name;
                const outputDir = path.join(OUTPUT_DIR, path.relative(INPUT_DIR, dir));
                createDirIfNotExist(outputDir);
                const outputPath = path.join(outputDir, `${imgName}.webp`);
                convertToWebp(filePath, outputPath);
            }
        }
    });
};

// Remove existing output directory
removeDirRecursive(OUTPUT_DIR);

// Create output directory
createDirIfNotExist(OUTPUT_DIR);

// Start traversal and conversion
traverseAndConvert(INPUT_DIR);

console.log("Conversion completed.")