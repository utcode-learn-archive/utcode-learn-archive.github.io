import { readFileSync, writeFileSync } from "node:fs";

const commits = JSON.parse(readFileSync("./gh-pages/commits.json", "utf-8"));

const repositoryNames = await (async () => {
  const names = [];
  for (let page = 1; page <= 60; page++) {
    const response = await fetch(
      `https://api.github.com/orgs/utcode-learn-archive/repos?type=public&per_page=100&page=${page}`,
    );
    const data = await response.json();
    if (data.length === 0) {
      break;
    }
    names.push(...data.map((repository) => repository.name));
  }
  return names;
})();

const filteredCommits = commits
  .toReversed()
  .filter((commit) => !repositoryNames.includes(commit.commitHash))
  .slice(0, 50);

writeFileSync("./filtered-commits.json", JSON.stringify(filteredCommits));
