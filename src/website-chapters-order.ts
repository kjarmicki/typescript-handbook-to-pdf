import _fetch from 'node-fetch';
import CheerioAPI from 'cheerio';

export default class WebsiteChaptersOrder {
  private static readonly V1_CHAPTERS_SELECTOR = 'a[href="#toc-handbook"] + ul > li a';

  constructor(
    private readonly websiteUrl: string,
    private readonly fetch: typeof _fetch,
    private readonly cheerio: CheerioAPI
  ) {}

  async sort(this: WebsiteChaptersOrder, files: string[]): Promise<string[]> {
    const orderedChapterNames = await this.downloadOrderedChaptersFromWebsite();
    return this.orderChaptersAccordingToNames(orderedChapterNames, files);
  }

  private async downloadOrderedChaptersFromWebsite(): Promise<string[]> {
    const websiteHtml = (await (await this.fetch(this.websiteUrl)).text());
    const website$ = this.cheerio.load(websiteHtml);
    const links = website$(WebsiteChaptersOrder.V1_CHAPTERS_SELECTOR).toArray();
    return links
      .map((link) => link.attribs.href)
      .map(WebsiteChaptersOrder.normalizeName)
      .filter(Boolean);
  }

  private orderChaptersAccordingToNames(orderedNames: string[], chapterFiles: string[]): string[] {
    const remainingChapterFiles = [...chapterFiles];
    const orderedChapterFiles: string[] = [];
    for (const orderedName of orderedNames) {
      const matchingChapterIndex = remainingChapterFiles.findIndex(
        (chapterFile) => WebsiteChaptersOrder.normalizeName(chapterFile) === orderedName
      );
      if (matchingChapterIndex) {
        orderedChapterFiles.push(...remainingChapterFiles.splice(matchingChapterIndex, 1));
      }
    }
    return [...orderedChapterFiles, ...remainingChapterFiles];
  }

  private static normalizeName(name: string): string {
    return name.split(/[\\\/]/).pop()
      ?.toLowerCase()
      .replace(/\.(.*)$/, '')
      .replace(/ /g, '-') ?? '';
  }  
}