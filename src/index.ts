import path from 'path';
import fs from 'fs';
import execa from 'execa';
import mpdf from 'markdown-pdf';
import createGithubClient, { GithubClient } from './github';
import createFiles, { Files } from './files';
import makePdf from './pdf';

(async () => {
    const githubClient: GithubClient = createGithubClient(execa, console.log);
    const files: Files = createFiles(fs);
    const clonedRepoDir: string = 
        await githubClient.clone('Microsoft/TypeScript-Handbook', path.join(process.cwd(), 'temp'));
    const markdownFiles: string[] = files.findMarkdown(path.join(clonedRepoDir, 'pages'));
    console.log(markdownFiles);
})();
