import {sep} from 'path';
import Files from './files';

export default class ChapterFile {
  constructor(
    private readonly filePath: string,
    private readonly files: Files
  ) {
    if (filePath === '') {
      throw new Error('File path cannot be empty!');
    }
  }

  getName(this: ChapterFile): string {
    return this.filePath.split('/').pop()!;
  }

  getTitle(this: ChapterFile): string {
    return this.getName().replace('.md', '');
  }
  
  async getContents(this: ChapterFile): Promise<string> {
    return this.files.readFile(this.filePath);
  }
}