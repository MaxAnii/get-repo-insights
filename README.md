# GetYourGitHubProjects 🚀🚀🚀

## Overview 🎯🎯🎯
**GetYourGitHubProjects** is an NPM package that allows users to automatically fetch project details from their GitHub repositories. This is useful for dynamically updating portfolios without manually adding project information.

## Features 🔥🔥🔥
- Fetch project descriptions from all repositories or a specific one.
- Sort repositories by the most recently updated.
- Handle GitHub API rate limits with automatic retries.
- Retrieve additional repository information such as stars, forks, and last updated date.
- Optional support for GitHub personal access tokens for higher rate limits.

## Installation 📦📦📦
```sh
npm install get-your-projects
```

## Usage 🛠️🛠️🛠️
### Importing the Package
```ts
import GetYourGitHubProjects from "get-your-projects";
```

### Fetching Project Data 📊📊📊
#### Fetch Data from All Repositories
```ts
const fetcher = new GetYourGitHubProjects("your-github-username", "description.json");
fetcher.fetchRepositoryFiles().then((projects) => console.log(projects));
```

#### Fetch Data from a Specific Repository
```ts
const fetcher = new GetYourGitHubProjects("your-github-username", "description.json", "repo-name");
fetcher.fetchRepositoryFiles().then((project) => console.log(project));
```

#### Using a GitHub Token for Higher Rate Limits 🔑🔑🔑
```ts
const fetcher = new GetYourGitHubProjects("your-github-username", "description.json", "", "your-github-token");
fetcher.fetchRepositoryFiles().then((projects) => console.log(projects));
```

## API Methods 📖📖📖
### Constructor
```ts
new GetYourGitHubProjects(username: string, filename: string, reponame?: string, token?: string)
```
- **username** *(required)*: GitHub username.
- **filename** *(required)*: The filename to fetch from repositories (e.g., `description.json`).
- **reponame** *(optional)*: Fetch data from a specific repository.
- **token** *(optional)*: GitHub personal access token for higher rate limits.

### Methods
#### `fetchRepositoryFiles(): Promise<any[]>` 📂📂📂
Fetches the project details either from all repositories or a specific one if `reponame` is provided.

## Handling Rate Limits ⏳⏳⏳
If the GitHub API rate limit is exceeded, the package automatically retries requests using exponential backoff. For higher rate limits, provide a GitHub personal access token.

## License 📜📜📜
This project is licensed under the MIT License.

## Contributing 🤝🤝🤝
Contributions are welcome! Feel free to open an issue or submit a pull request.

## Author ✍️✍️✍️
**maxAnii**

## Repository 🔗🔗🔗
[GitHub Repository](https://github.com/maxAnii/get-your-projects)

