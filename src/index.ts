import {join} from 'path';
import * as execa from 'execa';
import {promises} from 'fs';
import {promisify} from 'util';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import * as mpdf from 'markdown-pdf';
import * as rimraf from 'rimraf';
import WebsiteChaptersOrder from './website-chapters-order';
import Files from './files';
import GithubClient from './github';
import makePdf from './pdf';

(async () => {
  const {log} = console;
  const cwd = process.cwd();
  const promisedRimraf = promisify(rimraf);

  const files = new Files(promises, promisedRimraf);
  const githubClient = new GithubClient(execa, files);
  const websiteChaptersOrder = new WebsiteChaptersOrder('https://www.typescriptlang.org/docs/handbook/basic-types.html', fetch, cheerio);

  log('Cloning the Handbook repo...');
  const clonedRepoDir: string = await githubClient.clone('Microsoft/TypeScript-Handbook', join(cwd, 'temp'));
  const markdownFiles: string[] = await files.findMarkdown(join(clonedRepoDir, 'pages'));
  log('Ordering markdown files according to the website...');
  const orderedFiles = await websiteChaptersOrder.sort(markdownFiles);
  log('Creating the pdf...');
  const pdfPath = join(cwd, 'handbook.pdf');
  await makePdf(mpdf().concat, orderedFiles, pdfPath);
  log(`Done, the pdf is available at ${pdfPath}`);
})();
