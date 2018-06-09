import { ExecaStatic, ExecaReturns } from 'execa';
import path from 'path';

export interface GithubClient {
    clone(repo: string, path: string): Promise<string>;
}

export default function createGithubClient(execa: ExecaStatic): GithubClient {
    function buildUrl(repo: string): string {
        return `git@github.com:${repo}.git`;
    }

    function directoryFromRepo(repo: string): string {
        const dir = repo.split('/').pop();
        if(!dir) {
            throw new Error(`Unable to determine directory for repo ${repo}`);
        }
        return dir;
    }

    return {
        async clone(repo, cwd) {
            await execa('rm', ['-rf', cwd]);
            await execa('mkdir', [cwd]);
            await execa('git', ['clone', buildUrl(repo)], {
                cwd
            });
            return path.join(cwd, directoryFromRepo(repo));
        }
    };
}
