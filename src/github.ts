import { ExecaStatic, ExecaReturns } from 'execa';
import fs from 'fs';
import path from 'path';

export interface GithubClient {
    clone(repo: string, path: string): Promise<string>;
}

export default function createGithubClient(execa: ExecaStatic): GithubClient {
    function buildUrl(repo: string): string {
        return `https://github.com/${repo}.git`;
    }

    function directoryFromRepo(repo: string): string {
        const dir = repo.split('/').pop();
        if(!dir) {
            throw new Error(`Unable to determine directory for repo ${repo}`);
        }
        return dir;
    }

    // Based on https://stackoverflow.com/a/32197381/613130
    function deleteFolderRecursiveSync(p: string): void {
        if (fs.existsSync(p)) {
            fs.readdirSync(p).forEach((file: string, index: number) => {
                const curPath = path.join(p, file);
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursiveSync(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(p);
        }
    }

    return {
        async clone(repo, cwd) {
            deleteFolderRecursiveSync(cwd);
            fs.mkdirSync(cwd);
            await execa('git', ['clone', buildUrl(repo)], {
                cwd
            });
            return path.join(cwd, directoryFromRepo(repo));
        }
    };
}
