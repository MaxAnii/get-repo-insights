class GetYourGitHubProjects {
	private baseUrl: string = "https://api.github.com/users/";
	private username: string = "";
	private filename: string = "";
	private reponame?: string;
	private token?: string; // GitHub Token (Optional for higher rate limits)

	/**
	 * Initializes the GitHub project fetcher with a username, filename, and optional repository name.
	 * @param {string} username - GitHub username of the target user.
	 * @param {string} filename - Name of the file containing project details (e.g., description.json).
	 * @param {string} [reponame] - (Optional) Name of a specific repository to fetch details from.
	 * @param {string} [token] - (Optional) GitHub personal access token for authentication.
	 */
	constructor(
		username: string,
		filename: string,
		reponame?: string,
		token?: string
	) {
		this.username = username;
		this.filename = filename;
		this.reponame = reponame;
		this.token = token;
	}

	/**
	 * Fetches data from the GitHub API with retry logic in case of rate limiting.
	 * Implements exponential backoff when hitting rate limits.
	 * @param {string} url - The GitHub API URL to fetch.
	 * @param {number} [attempt] - The current retry attempt (default: 1).
	 * @returns {Promise<any>} A promise resolving to the fetched data.
	 */
	private async fetchWithRateLimit(
		url: string,
		attempt: number = 1
	): Promise<any> {
		const headers: HeadersInit = this.token
			? { Authorization: `token ${this.token}` }
			: {};
		const response = await fetch(url, { headers });

		// Check if rate-limited
		if (response.status === 403) {
			const resetTime = response.headers.get("X-RateLimit-Reset");
			if (resetTime) {
				const waitTime =
					new Date(parseInt(resetTime) * 1000).getTime() - Date.now();
				console.warn(
					`Rate limit exceeded. Retrying after ${Math.ceil(
						waitTime / 1000
					)} seconds...`
				);
				await new Promise((resolve) => setTimeout(resolve, waitTime));
				return this.fetchWithRateLimit(url, attempt);
			}
		}

		// Retry on temporary failures with exponential backoff
		if (!response.ok && attempt < 5) {
			const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
			console.warn(
				`Request failed (${response.status}). Retrying in ${
					waitTime / 1000
				} seconds...`
			);
			await new Promise((resolve) => setTimeout(resolve, waitTime));
			return this.fetchWithRateLimit(url, attempt + 1);
		}

		return response.ok ? response.json() : null;
	}

	/**
	 * Fetches the list of repositories for the specified GitHub user.
	 * @returns {Promise<any[]>} A promise that resolves to an array of repository details.
	 * @private
	 */
	private async getRepos(): Promise<any[]> {
		const data = await this.fetchWithRateLimit(
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
		return this.fetchWithRateLimit(fileUrl);
	}

	/**
	 * Fetches the specified file from either a single repository (if `reponame` is set)
	 * or from all repositories and returns an array of file contents along with repository metadata.
	 * The results are sorted by last updated date (most recent first).
	 * @returns {Promise<any[]>} A promise that resolves to an array of project details with additional information.
	 */
	async fetchRepositoryFiles(): Promise<any[]> {
		if (this.reponame) {
			// Fetch details for a single repo
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

		// Fetch all repositories
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

		// Remove null values and sort by updated_at (newest first)
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
// const fetcher = new GetYourGitHubProjects(
// 	"maxAnii",
// 	"description.json",
// 	"",
// 	""
// );
// fetcher.fetchRepositoryFiles().then((files) => console.log(files));
