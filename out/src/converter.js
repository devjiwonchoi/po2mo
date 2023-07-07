"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPoToMo = exports.processPoFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const gettext_parser_1 = require("gettext-parser");
function processPoFiles(configFile) {
    // Read the JSON configuration file
    const configData = fs_1.default.readFileSync(configFile, 'utf-8');
    const config = JSON.parse(configData);
    // Process each task
    config.files.forEach((task) => {
        // Resolve the absolute input and output paths
        const absoluteInputPath = path_1.default.resolve(task.input);
        const absoluteOutputPath = path_1.default.resolve(task.output);
        // Check if the input is a directory
        if (fs_1.default.existsSync(absoluteInputPath) &&
            fs_1.default.statSync(absoluteInputPath).isDirectory()) {
            // Read the directory
            const files = fs_1.default.readdirSync(absoluteInputPath);
            // Filter .po files
            const poFiles = files.filter((file) => file.endsWith('.po'));
            // Process each .po file
            poFiles.forEach((poFile) => {
                // Generate the corresponding .mo file path
                const moFilePath = path_1.default.join(absoluteOutputPath, poFile.replace('.po', '.mo'));
                convertPoToMo(path_1.default.join(absoluteInputPath, poFile), moFilePath);
            });
        }
        else {
            // Check if the input file exists
            if (fs_1.default.existsSync(absoluteInputPath)) {
                // Generate the corresponding .mo file path
                const moFilePath = path_1.default.join(absoluteOutputPath, config.defaultOutputFilename);
                convertPoToMo(absoluteInputPath, moFilePath);
            }
            else {
                console.log(`Input file not found: ${task.input}`);
            }
        }
    });
}
exports.processPoFiles = processPoFiles;
function convertPoToMo(poFilePath, moFilePath) {
    // Resolve the absolute file paths
    const absolutePoFilePath = path_1.default.resolve(poFilePath);
    const absoluteMoFilePath = path_1.default.resolve(moFilePath);
    // Read the .po file
    const poFileContent = fs_1.default.readFileSync(absolutePoFilePath, 'utf-8');
    // Parse the .po file content
    const poData = gettext_parser_1.po.parse(poFileContent);
    // Convert to .mo format
    const moData = gettext_parser_1.mo.compile(poData);
    // Write the .mo data to the .mo file
    fs_1.default.writeFileSync(absoluteMoFilePath, moData);
}
exports.convertPoToMo = convertPoToMo;
