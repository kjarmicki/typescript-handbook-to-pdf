import {join} from 'path';
import {promises} from 'fs';
import {PromisedRimraf} from 'promised-rimraf';

export default class Files {
  constructor(
    private readonly fs: typeof promises,
    private readonly rimraf: PromisedRimraf
  ) { }

  async findMarkdown(this: Files, dir: string): Promise<string[]> {
    const files: string[] = await this.fs.readdir(dir);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => join(dir, file));
  }

  async cleanup(this: Files, dir: string): Promise<void> {
    await this.rimraf(dir);
    await this.fs.mkdir(dir);
  }
}
