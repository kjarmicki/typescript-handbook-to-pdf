declare module 'markdown-pdf' {
    interface MarkdownPdf {
        (): MarkdownPdfFrom
        concat: MarkdownPdfFrom
    }
    interface MarkdownPdfFrom {
        from(mdFiles: string | string[]) : MarkdownPdfTo
    }
    interface MarkdownPdfTo {
        to(
            pdfFiles: string | string[],
            callback: () => void
        ): void
    }
}
