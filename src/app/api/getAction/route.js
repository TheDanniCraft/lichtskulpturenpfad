import { promises as fs } from 'fs';
import path from 'path';


export async function GET(request) {
    const dataDir = path.join(process.cwd(), 'public', 'data');
    await fs.mkdir(dataDir, { recursive: true });

    const files = await fs.readdir(dataDir);

    if (files.length === 0) {
        return new Response('No files found', { status: 404 });;
    }

    const oldestFile = files.sort()[0];
    const content = await fs.readFile(path.join(dataDir, oldestFile), 'utf-8');

    if (content) {
        await fs.unlink(path.join(dataDir, oldestFile));
        return new Response(content.toUpperCase(), { status: 200 });
    }
}