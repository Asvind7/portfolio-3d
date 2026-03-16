const fs = require('fs');
const path = require('path');

// Since I don't have a GLB parser handy in node without installing heavy dependencies, 
// I'll try to look for strings in the binary file that look like animation names.
// This is a bit hacky but often works for GLB if the names are plain.

const filePath = 'e:/portfolio_3d/public/models/hero character.glb';
const buffer = fs.readFileSync(filePath);

// GLB animations are usually stored in a JSON chunk. 
// We can try to find the JSON part.
const jsonChunkType = 0x4E4F534A; // "JSON"
let offset = 12; // Skip header

while (offset < buffer.length) {
    const chunkLength = buffer.readUInt32LE(offset);
    const chunkType = buffer.readUInt32LE(offset + 4);
    if (chunkType === jsonChunkType) {
        const jsonBuffer = buffer.slice(offset + 8, offset + 8 + chunkLength);
        const json = JSON.parse(jsonBuffer.toString());
        if (json.animations) {
            console.log("Animations found:");
            json.animations.forEach((anim, i) => {
                console.log(`${i}: ${anim.name}`);
            });
        } else {
            console.log("No animations found in JSON chunk.");
        }
        break;
    }
    offset += 8 + chunkLength;
}
