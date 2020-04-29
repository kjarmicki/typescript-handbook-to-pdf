import {join} from 'path';
import {promises} from 'fs';
import {PromisedRimraf} from 'promised-rimraf';
import ChapterFile from './chatpter-file';

export default class Files {
  constructor(
    private readonly fs: typeof promises,
    private readonly rimraf: PromisedRimraf
  ) { }

  async findChapters(this: Files, dir: string): Promise<ChapterFile[]> {
    const files: string[] = await this.fs.readdir(dir);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => join(dir, file))
      .map(filePath => new ChapterFile(filePath, this));
  }

  async readFile(this: Files, path: string): Promise<string> {
    return (await this.fs.readFile(path)).toString('utf-8');
  }

  async cleanup(this: Files, dir: string): Promise<void> {
    await this.rimraf(dir);
    await this.fs.mkdir(dir);
  }
}
