"use server"

import { promises as fs } from 'fs';
import path from 'path';

export async function save(id) {
    const projectRoot = path.resolve(process.cwd());
    const dataDir = path.join(projectRoot, 'public', 'data');

    await fs.mkdir(dataDir, { recursive: true });

    const filePath = path.join(dataDir, `${Date.now()}.txt`);
    let lastActionTime = 0;

    try {
        const files = await fs.readdir(dataDir);
        const txtFiles = files.filter(file => /^\d+\.txt$/.test(file));
        if (txtFiles.length > 0) {
            const lastFile = txtFiles.sort().pop();
            lastActionTime = parseInt(lastFile.split('.')[0], 10);
        }
    } catch (err) {
        console.error('Error reading directory:', err);
    }

    const currentTime = Date.now();
    if (currentTime - lastActionTime < 10000) {
        if (id != "Aus" && id != "Ein") {
            console.log('Action skipped: Less than 10 seconds since the last action.');
            return;
        }
    }

    await fs.writeFile(filePath, id, 'utf8');
}