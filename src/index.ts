import execa from 'execa';
import createGithubClient, { GithubClient } from './github';

(async () => {
    const githubClient: GithubClient = createGithubClient(execa, console.log);
    await githubClient.clone('Microsoft/TypeScript-Handbook', `${process.cwd()}/temp`);
})();
