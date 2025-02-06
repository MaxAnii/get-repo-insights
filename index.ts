class GetYourGitHubProjects {
	private baseUrl: string = "https://api.github.com/users/";
	private username: string = "";
	private filename: string = "";
	private token: string; // GitHub Token (Required for authentication)
	private reponame?: string;

	/**
	 * Initializes the GitHub project fetcher with a username, filename, repository name, and a required token.
	 * @param {string} username - GitHub username of the target user.
	 * @param {string} filename - Name of the file containing project details (e.g., description.json).
	 * @param {string} token - GitHub personal access token for authentication.
	 * @param {string} [reponame] - (Optional) Name of a specific repository to fetch details from.
	 */
	constructor(
		username: string,
		filename: string,
		token: string,
		reponame?: string
	) {
		this.username = username;
		this.filename = filename;
		this.token = token;
		this.reponame = reponame;
	}

	/**
	 * Fetches data from the GitHub API.
	 * @param {string} url - The GitHub API URL to fetch.
	 * @returns {Promise<any>} A promise resolving to the fetched data.
	 */
	private async fetchFromGitHub(url: string): Promise<any> {
		const headers: HeadersInit = { Authorization: `token ${this.token}` };
		const response = await fetch(url, { headers });
		return response.ok ? response.json() : null;
	}

	/**
	 * Fetches the list of repositories for the specified GitHub user.
	 * @returns {Promise<any[]>} A promise that resolves to an array of repository details.
	 * @private
	 */
	private async getRepos(): Promise<any[]> {
		const data = await this.fetchFromGitHub(
			`${this.baseUrl}${this.username}/repos`
		);
		if (!data) return [];

		return data.map((repo: any) => ({
			name: repo.name,
			stars: repo.stargazers_count,
			forks: repo.forks_count,
			updated_at: repo.updated_at,
			url: repo.html_url,
		}));
	}

	/**
	 * Fetches project details from a specific repository.
	 * @param {string} repoName - The name of the repository.
	 * @returns {Promise<any | null>} A promise that resolves to the file content or null if unavailable.
	 * @private
	 */
	private async fetchProjectDetails(repoName: string): Promise<any | null> {
		const fileUrl = `https://raw.githubusercontent.com/${this.username}/${repoName}/master/${this.filename}`;
		return this.fetchFromGitHub(fileUrl);
	}

	/**
	 * Fetches the specified file from either a single repository (if `reponame` is set)
	 * or from all repositories and returns an array of file contents along with repository metadata.
	 * The results are sorted by last updated date (most recent first).
	 * @returns {Promise<any[]>} A promise that resolves to an array of project details with additional information.
	 */
	async fetchRepositoryFiles(): Promise<any[]> {
		if (this.reponame) {
			const projectData = await this.fetchProjectDetails(this.reponame);
			if (projectData) {
				return [
					{
						...projectData,
						additionalInformation: {
							name: this.reponame,
							url: `https://github.com/${this.username}/${this.reponame}`,
						},
					},
				];
			}
			return [];
		}

		const repos = await this.getRepos();
		const fileContents = await Promise.all(
			repos.map(async (repo) => {
				const projectData = await this.fetchProjectDetails(repo.name);
				if (projectData) {
					return { ...projectData, additionalInformation: repo };
				}
				return null;
			})
		);

		return fileContents
			.filter(Boolean)
			.sort(
				(a: any, b: any) =>
					new Date(b.additionalInformation.updated_at).getTime() -
					new Date(a.additionalInformation.updated_at).getTime()
			);
	}
}

export default GetYourGitHubProjects;

// Example Usage
// const fetcher = new GetYourGitHubProjects("maxAnii", "description.json", "your-github-token");
// fetcher.fetchRepositoryFiles().then((files) => console.log(files));
