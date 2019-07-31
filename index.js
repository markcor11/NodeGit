var Git = require("nodegit");

// Clone a given repository into the `./hello` folder.
async function doGitClone(gitRemoteRepoURL, gitDirectory) {
    await Git.Clone(gitRemoteRepoURL, gitDirectory)
        // Look up this known commit.
        .then(function (repo) {
            // Use a known commit sha from this repository.
            return repo.getCommit("10db8d0558708d8ef3a707219562b491757104d6");
        })
        // Look up a specific file within that commit.
        .then(function (commit) {
            return commit.getEntry("README.md");
        })
        // Get the blob contents from the file.
        .then(function (entry) {
            // Patch the blob to contain a reference to the entry.
            return entry.getBlob().then(function (blob) {
                blob.entry = entry;
                return blob;
            });
        })
        // Display information about the blob.
        .then(function (blob) {
            // Show the path, sha, and filesize in bytes.
            console.log(blob.entry.path() + blob.entry.sha() + blob.rawsize() + "b");

            // Show a spacer.
            console.log(Array(72).join("=") + "\n\n");

            // Show the entire file.
            console.log(String(blob));
        })
        .catch(function (err) { console.log(err); });
}

async function doUpdateGitConfig(gitDirectory, key, value) {
    await Git.Repository.open(gitDirectory) //2
        .then(function (repository) {
            return repository.config()
                .then(function (config) {
                    return config.setString(key, value);
                })
        })
}

async function getConfigValue(gitDirectory, key) { //3
    return await Git.Repository.open(gitDirectory)
        .then(function (repository) {
            return repository.config()
                .then(function (config) {
                    return config.getStringBuf(key);
                })
                .then(function (answer) {
                    return answer;
                })
        })
}

async function doTest(gitDirectory) {
    let username = await getConfigValue(gitDirectory, 'user.name');
    console.log(username)
}


// doGitClone("https://github.com/markcor11/Hello_World.git", "./hello_world");
doUpdateGitConfig("./hello_world", 'user.name', 'Bob');
doTest("./hello_world");