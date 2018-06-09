import { MarkdownPdfFrom } from 'markdown-pdf';

export default async function makePdf(
    concat: MarkdownPdfFrom,
    files: string[],
    output: string): Promise<void> {
        return new Promise<void>(resolve => {
            return concat.from(files).to(output, resolve);
        });
    }