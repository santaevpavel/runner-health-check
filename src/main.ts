import * as core from '@actions/core'
// @ts-ignore
import { Octokit } from '@octokit/action'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const octokit = new Octokit({
      auth: core.getInput('token')
    })

    const repository = core.getInput('repository')
    const owner = repository.substring(0, repository.indexOf('/'))
    const repo = repository.substring(
      repository.indexOf('/') + 1,
      repository.length
    )
    core.info(`Resolved owner = ${owner}, repo = ${repo}`)

    const runners = await octokit.request(
      'GET /repos/{owner}/{repo}/actions/runners',
      {
        owner: owner,
        repo: repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )
    core.info(`${JSON.stringify(runners)}`)

    // Set outputs for other workflow steps to use
    core.setOutput('number-all-runners', 0)
    core.setOutput('number-online-runners', 0)
    core.setOutput('number-offline-runners', 0)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
