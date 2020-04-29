import {sep} from 'path';
import _fetch from 'node-fetch';
import CheerioAPI from 'cheerio';
import ChapterFile from './chatpter-file';

export default class WebsiteChaptersOrder {
  private static readonly V1_CHAPTERS_SELECTOR = '#toc-handbook li a';

  constructor(
    private readonly websiteUrl: string,
    private readonly fetch: typeof _fetch,
    private readonly cheerio: CheerioAPI
  ) {}

  async sort(this: WebsiteChaptersOrder, chapterFiles: ChapterFile[]): Promise<ChapterFile[]> {
    const orderedChapterNames = await this.downloadOrderedChaptersFromWebsite();
    return this.orderChaptersAccordingToNames(orderedChapterNames, chapterFiles);
  }

  private async downloadOrderedChaptersFromWebsite(): Promise<string[]> {
    const websiteHtml = (await (await this.fetch(this.websiteUrl)).text());
    const website$ = this.cheerio.load(websiteHtml);
    const links = website$(WebsiteChaptersOrder.V1_CHAPTERS_SELECTOR).toArray();
    return links
      .map((link) => link.attribs.href.split('/').pop())
      .filter((pathName) => pathName !== undefined)
      .map((pathName) => WebsiteChaptersOrder.normalizeName(pathName!));
  }

  private orderChaptersAccordingToNames(orderedNames: string[], chapterFiles: ChapterFile[]): ChapterFile[] {
    const remainingChapterFiles = [...chapterFiles];
    const orderedChapterFiles: ChapterFile[] = [];
    for (const orderedName of orderedNames) {
      const matchingChapterIndex = remainingChapterFiles.findIndex(
        (chapterFile) => WebsiteChaptersOrder.normalizeName(chapterFile.getName()) === orderedName
      );
      if (matchingChapterIndex) {
        orderedChapterFiles.push(...remainingChapterFiles.splice(matchingChapterIndex, 1));
      }
    }
    return [...orderedChapterFiles, ...remainingChapterFiles];
  }

  private static normalizeName(name: string): string {
    return name.toLowerCase()
      .replace(/\.(.*)$/, '')
      .replace(/ /g, '-');
  }  
}