import _execa from 'execa';
import {join} from 'path';
import Files from './files';

export default class GithubClient {
  constructor(
    private readonly execa: typeof _execa,
    private readonly files: Files
  ) {}

  public async clone(this: GithubClient, repo: string, dir: string): Promise<string> {
    await this.files.cleanup(dir);
    await this.execa('git', ['clone', GithubClient.buildUrl(repo)], {
      cwd: dir
    });
    return join(dir, GithubClient.directoryFromRepo(repo));
  }

  private static buildUrl(repo: string): string {
    return `https://github.com/${repo}.git`;
  }

  private static directoryFromRepo(repo: string): string {
    const dir = repo.split('/').pop();
    if(!dir) {
      throw new Error(`Unable to determine directory for repo ${repo}`);
    }
    return dir;
  }
}
