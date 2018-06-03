export interface Files {
    findMarkdown: (dir: string) => string[];
}

export default function createFiles(fs: any): Files { // TODO: proper typing for fs
    return {
        findMarkdown(dir) {
            const files: string[] = fs.readdirSync(dir);
            return files.filter(file => file.endsWith('.md'));
        }
    }
}