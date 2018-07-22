declare module 'markdown-pdf' {
    export interface MarkdownPdf {
        (): MarkdownPdfFrom
        concat: MarkdownPdfFrom
    }
    export interface MarkdownPdfFrom {
        from(mdFiles: string | string[]) : MarkdownPdfTo
    }
    export interface MarkdownPdfTo {
        to(
            pdfFiles: string | string[],
            callback: () => void
        ): void
    }

    export default function markdownPdf(): MarkdownPdf
}
