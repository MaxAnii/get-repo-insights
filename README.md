# GetYourGitHubProjects 🚀🚀🚀

## Overview 🎯🎯🎯

**GetYourGitHubProjects** is an NPM package that allows users to automatically
fetch project details from their GitHub repositories. This is useful for
dynamically updating portfolios without manually adding project information.

## Features 🔥🔥🔥

- Fetch project descriptions from all repositories or a specific one.
- Sort repositories by the most recently updated.
- Retrieve additional repository information such as stars, forks, and last
  updated date.
- Requires a GitHub personal access token for authentication.

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
const fetcher = new GetYourGitHubProjects(
	"your-github-username",
	"file-name",
	"your-github-token"
);
fetcher.fetchRepositoryFiles().then((projects) => console.log(projects));
```

#### Fetch Data from a Specific Repository

```ts
const fetcher = new GetYourGitHubProjects(
	"your-github-username",
	"file-name",
	"your-github-token",
	"repo-name"
);
fetcher.fetchRepositoryFiles().then((project) => console.log(project));
```

## API Methods 📖📖📖

### Constructor

```ts
new GetYourGitHubProjects(username: string, filename: string, token: string, reponame?: string)
```

- **username** _(required)_: GitHub username.
- **filename** _(required)_: The filename to fetch from repositories (e.g.,
  `description.json`).
- **token** _(required)_: GitHub personal access token for authentication.
- **reponame** _(optional)_: Fetch data from a specific repository.

### Methods

#### `fetchRepositoryFiles(): Promise<any[]>` 📂📂📂

Fetches the project details either from all repositories or a specific one if
`reponame` is provided.

## License 📜📜📜

This project is licensed under the MIT License.

## Contributing 🤝🤝🤝

Contributions are welcome! Feel free to open an issue or submit a pull request.

## Author ✍️✍️✍️

**maxAnii**

## Repository 🔗🔗🔗

[GitHub Repository](https://github.com/maxAnii/get-your-projects)
