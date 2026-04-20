// Determine changelog file based on branch
const branch =
  process.env.GITHUB_REF_NAME || process.env.CI_COMMIT_BRANCH || "main";
const isBeta = branch === "beta";
const changelogFile = isBeta ? "CHANGELOG-beta.md" : "CHANGELOG.md";

module.exports = {
  branches: ["main", { name: "beta", prerelease: true }],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile,
      },
    ],
    ["@semantic-release/npm", { npmPublish: true }],
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        assets: ["package.json", changelogFile],
        message: "chore(release): ${nextRelease.version} [skip ci]",
      },
    ],
  ],
};
