import {ConcatOptionsBuilder} from 'markdown-pdf';
import ChapterFile from './chatpter-file';

function decorateFileContentsWithTitle(chapterFile: ChapterFile, fileContents: string): string {
  return `# ${chapterFile.getTitle()}
  ---
  ${fileContents}`;
}

export default async function makePdf(
  concat: ConcatOptionsBuilder,
  chapterFiles: ChapterFile[],
  output: string): Promise<void> {
    const allFileContents = await Promise.all(
      chapterFiles
        .map(async (chapterFile) => {
          const contents = await chapterFile.getContents();
          return decorateFileContentsWithTitle(chapterFile, contents);
        })
    );
    return new Promise<void>(resolve => {
      concat.from.strings(allFileContents, {}).to(output, resolve);
    });
  }