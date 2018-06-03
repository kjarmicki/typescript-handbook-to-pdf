import { ExecaStatic, ExecaReturns } from 'execa';

export interface GithubClient {
    clone(repo: string, path: string): Promise<void>;
}

export default function createGithubClient(execa: ExecaStatic, log: Function): GithubClient {
    function buildUrl(repo: string): string {
        return `git@github.com:${repo}.git`;
    }

    return {
        async clone(repo, path) {
            log('Cloning handbook repo...');
            await execa('rm', ['-rf', path]);
            await execa('mkdir', [path]);
            await execa('git', ['clone', buildUrl(repo)], {
                cwd: path
            });
            log('Done\n');
        }
    };
}
