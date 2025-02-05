/**
 * A class to fetch project descriptions from a GitHub user's repositories.
 * This helps users dynamically update their portfolio by retrieving project details
 * from a specified file in each repository.
 */
class GetYourGitHubProjects {
	private baseUrl: string = "https://api.github.com/users/";
	private username: string = "";
	private filename: string = "";

	/**
	 * Initializes the GitHub project fetcher with a username and filename.
	 * @param {string} username - GitHub username of the target user.
	 * @param {string} filename - Name of the file containing project details (e.g., description.json).
	 */
	constructor(username: string, filename: string) {
		this.username = username;
		this.filename = filename;
	}

	/**
	 * Fetches the list of repositories for the specified GitHub user.
	 * @returns {Promise<string[]>} A promise that resolves to an array of repository names.
	 * @private
	 */
	private async getRepos(): Promise<any[]> {
		try {
			const response = await fetch(`${this.baseUrl}${this.username}/repos`);
			if (!response.ok) {
				throw new Error(`Error fetching repositories: ${response.statusText}`);
			}
			const data = await response.json();

			// Fetch comments count for each repo

			return data.map(async (repo: any) => ({
				name: repo.name,
				stars: repo.stargazers_count,
				forks: repo.forks_count,
				updated_at: repo.updated_at,
				url: repo.html_url,
			}));
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	/**
	 * Fetches the specified file from each repository and returns an array of file contents.
	 * @returns {Promise<any[]>} A promise that resolves to an array of file contents.
	 */
	async getProjects(): Promise<any[]> {
		try {
			const repos = await this.getRepos();
			console.log(repos);
			const fileContents: any[] = [];

			for (const repo of repos) {
				const fileUrl = `https://raw.githubusercontent.com/${this.username}/${repo.name}/main/${this.filename}`;
				try {
					const response = await fetch(fileUrl);
					if (response.ok) {
						let fileData = await response.json();
						fileData["additonalInformation"] = repo;
						fileContents.push(fileData);
					}
				} catch (error) {
					// console.warn(`Could not fetch ${this.filename} from ${repo}:`, error);
				}
			}
			return fileContents;
		} catch (error) {
			// console.error(error);
			return [];
		}
	}
}

export default GetYourGitHubProjects;

// Example Usage
// const fetcher = new GetYourGitHubProjects("maxAnii", "description.json");
// fetcher.getProjects().then((files) => console.log(files));
