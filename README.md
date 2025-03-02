# get-repo-insights 🚀✨🔥

![GitHub package](https://img.shields.io/github/package-json/v/maxAnii/get-your-projects)
![License](https://img.shields.io/github/license/maxAnii/get-your-projects)
![GitHub issues](https://img.shields.io/github/issues/maxAnii/get-your-projects)

## 🚀 Get Your GitHub Repository Insights Effortlessly ✨📊🔍

**get-repo-insights** is a simple package that helps you fetch insights about
your GitHub repositories, including metadata like stars, forks, and languages.
It also allows you to retrieve specific files from your repositories. 📂📡🔗

This package is built in a **Bun environment**, ensuring faster execution and
optimized performance. ⚡🐰🚀

## ✨ Features 🎯📌🚀

- Fetch all repositories of a user with metadata
- Retrieve specific details of a particular repository
- Fetch specific file data from repositories
- Sort repositories by creation date (newest first)
- Simple and efficient API requests

## 📦 Installation 🔧🛠️⚙️

```sh
npm i get-repo-insights
```

## 🛠 Usage 📖💡⚡

### Importing the package 📦🚀✨

```ts
import RepoInsights from "get-repo-insights";
```

### Fetch all repositories of a user 🔍📂📊

```ts
const fetcher = new RepoInsights("maxAnii");
fetcher.fetchInsights().then((repos) => console.log(repos));
```

#### Example Output 📜📊🖥️

```json
[
	{
		"name": "ProjectHarbor",
		"description": "A powerful project management tool",
		"topics": ["project-management", "tasks"],
		"language": "TypeScript",
		"repoURL": "https://github.com/maxAnii/ProjectHarbor",
		"liveURL": "https://projectharbor.com",
		"stars": 120,
		"forks": 30,
		"createdAt": "2023-05-15T10:00:00Z",
		"updatedAt": "2024-02-25T08:00:00Z"
	}
]
```

### Fetch insights for a all repository 🔍📊💡

```ts
const fetcher = new RepoInsights("maxAnii");
fetcher.fetchInsights().then((repo) => console.log(repo));
```

### Fetch a specific file from all repositories 📂🔍📊

```ts
const fetcher = new RepoInsights("maxAnii", "description.json");
fetcher.fetchInsights().then((files) => console.log(files));
```

### Fetch a specific file from a particular repository 📂🔍🔗

```ts
const fetcher = new RepoInsights(
	"maxAnii",
	"description.json",
	"ProjectHarbor"
);
fetcher.fetchInsights().then((file) => console.log(file));
```

## 🔥 Use Cases 🚀🎯💡

- **Portfolio Integration**: Fetch and display GitHub projects dynamically on a
  personal portfolio.
- **Project Analytics**: Analyze and compare repositories based on stars, forks,
  and languages.
- **Repository Backup**: Retrieve specific files from repositories for backup or
  migration.
- **Showcasing Open Source Work**: Display project insights directly in blogs or
  websites.

## 📄 License 📝⚖️✅

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🤝 Contributing 💡💻📬

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📬 Support 📩🙌📢

For any issues, check out the
[GitHub Issues](https://github.com/maxAnii/get-your-projects/issues) or contact
me at [GitHub](https://github.com/maxAnii).
