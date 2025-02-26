class RepoInsights {
	private baseUrl = "https://api.github.com/users/";
	private username: string;
	private filename?: string;
	private reponame?: string;

	/**
	 * Initializes an instance of RepoInsights.
	 * @param {string} username - GitHub username of the target user.
	 * @param {string} [filename] - (Optional) Name of the file to fetch from repositories.
	 * @param {string} [reponame] - (Optional) Specific repository to fetch details from.
	 */
	constructor(username: string, filename?: string, reponame?: string) {
		this.username = username;
		this.filename = filename;
		this.reponame = reponame;
	}

	/**
	 * Fetches data from the GitHub API.
	 * @param {string} url - The API endpoint to fetch data from.
	 * @returns {Promise<T | null>} - The fetched data or null if an error occurs.
	 */
	private async fetchFromGitHub<T>(url: string): Promise<T | null> {
		try {
			const response = await fetch(url);
			if (!response.ok) return null;
			return response.json();
		} catch (error) {
			console.error(`Error fetching ${url}:`, error);
			return null;
		}
	}

	/**
	 * Fetches metadata for a specific GitHub repository.
	 * @param {string} repoName - The name of the repository.
	 * @returns {Promise<any | null>} - Repository details or null if not found.
	 */
	private async getRepoDetails(repoName: string) {
		return this.fetchFromGitHub<any>(
			`https://api.github.com/repos/${this.username}/${repoName}`
		);
	}

	/**
	 * Fetches a list of repositories for the specified GitHub user.
	 * @returns {Promise<any[]>} - An array of repository details or an empty array if no repositories are found.
	 */
	private async getRepos() {
		const data = await this.fetchFromGitHub<any[]>(
			`${this.baseUrl}${this.username}/repos`
		);
		if (!data) return [];

		// Transform data to extract relevant repository details
		return data.map(
			({
				name,
				description,
				topics,
				language,
				html_url,
				homepage,
				stargazers_count,
				forks_count,
				created_at,
				updated_at,
			}) => ({
				name,
				description,
				topics,
				language,
				repoURL: html_url,
				liveURL: homepage,
				stars: stargazers_count,
				forks: forks_count,
				createdAt: created_at,
				updatedAt: updated_at,
			})
		);
	}

	/**
	 * Fetches a specific file from a repository if `filename` is provided.
	 * @param {string} repoName - The name of the repository.
	 * @returns {Promise<any | null>} - The file content or null if the file is not found.
	 */
	private async fetchFileData(repoName: string) {
		if (!this.filename) return null;
		const fileUrl = `https://raw.githubusercontent.com/${this.username}/${repoName}/master/${this.filename}`;
		return this.fetchFromGitHub<any>(fileUrl);
	}

	/**
	 * Fetches repository insights along with optional file data.
	 * If `reponame` is set, fetches data for a specific repository.
	 * Otherwise, fetches all repositories and optionally retrieves file contents.
	 * @returns {Promise<any[]>} - An array of repository insights and optional file data.
	 */
	async fetchInsights() {
		try {
			// If a specific repository is provided
			if (this.reponame) {
				const [repoDetails, fileData] = await Promise.all([
					this.getRepoDetails(this.reponame),
					this.fetchFileData(this.reponame),
				]);

				if (!repoDetails) return [];
				return fileData
					? [
							{
								...fileData,
								repoInsights: {
									name: repoDetails.name,
									description: repoDetails.description,
									topics: repoDetails.topics,
									language: repoDetails.language,
									repoURL: repoDetails.html_url,
									liveURL: repoDetails.homepage,
									stars: repoDetails.stargazers_count,
									forks: repoDetails.forks_count,
									createdAt: repoDetails.created_at,
									updatedAt: repoDetails.updated_at,
								},
							},
					  ]
					: [];
			}

			// Fetch all repositories for the user
			const repos = await this.getRepos();
			if (!this.filename) return repos; // If no file is needed, return repo details only

			// Fetch file data for each repository concurrently
			const fileResults = await Promise.allSettled(
				repos.map((repo) => this.fetchFileData(repo.name))
			);

			// Combine file data with repository metadata
			return repos
				.map((repo, index) => {
					const fileData =
						fileResults[index].status === "fulfilled"
							? fileResults[index].value
							: null;
					return fileData ? { ...fileData, repoInsights: repo } : null;
				})
				.filter(Boolean) // Remove null values
				.sort(
					(a: any, b: any) =>
						new Date(b.repoInsights.createdAt).getTime() -
						new Date(a.repoInsights.createdAt).getTime()
				); // Sort by creation date (newest first)
		} catch (error) {
			console.error("Error fetching repository data:", error);
			return [];
		}
	}
}

export default RepoInsights;

// Example Usage
const fetcher = new RepoInsights(
	"maxAnii",
	"description.json",
	"ProjectHarbor"
);
fetcher.fetchInsights().then((repos) => console.log(repos));
