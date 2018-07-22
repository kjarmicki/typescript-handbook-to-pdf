import path from 'path';
import fs from 'fs';
import execa from 'execa';
import mpdf from 'markdown-pdf';
import createGithubClient, { GithubClient } from './github';
import createFiles, { Files } from './files';
import makePdf from './pdf';

(async () => {
    const cwd = process.cwd();
    const githubClient: GithubClient = createGithubClient(execa);
    const files: Files = createFiles(fs);
    const { log } = console;

    log('Cloning handbook repo...');
    const clonedRepoDir: string = 
        await githubClient.clone('Microsoft/TypeScript-Handbook', path.join(cwd, 'temp'));
    log('Done');
    const markdownFiles: string[] = files.findMarkdown(path.join(clonedRepoDir, 'pages'));
    log('Creating pdf...');
    await makePdf(mpdf().concat, markdownFiles, path.join(cwd, 'handbook.pdf'));
    log('Done');
})();
