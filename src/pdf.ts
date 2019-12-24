import {ConcatOptionsBuilder} from 'markdown-pdf';

export default async function makePdf(
  concat: ConcatOptionsBuilder,
  files: string[],
  output: string): Promise<void> {
    return new Promise<void>(resolve => {
      concat.from.paths(files, {}).to(output, resolve);
    });
  }