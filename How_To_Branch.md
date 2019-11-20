# How to Branch

## Creating a Local Branch for a Desired Feature
Create and checkout a branch:
```
$ git branch [BRANCH-NAME]
$ git checkout [BRANCH-NAME]
```
To see local branches, run:
```
$ git branch
```
Make changes via commits on your local branch:
```
$ git commit -m '[COMMIT-MESSAGE]'
```

## Pushing a Branch to the Remote Repo
To push your local branch to remote, run:
```
$ git push -u origin [BRANCH-NAME]
```
To then see all branches, including remote branches, run:
```
$ git branch -a
```

## Merging a Branch

[In most cases, make a pull request via GitHub.](https://help.github.com/en/articles/creating-a-pull-request#creating-the-pull-request)

Otherwise, if changes are small and/or do not affect code functionality (e.g. documentation updates), read the following.

First, switch back to the master branch and pull any changes:
```
$ git checkout master
$ git pull origin master
```

Merge your branch:
```
$ git merge [BRANCH-NAME]
```

Verify which branches that have been merged so far:
```
$ git branch --merged
```

Finally, push your changes:
```
$ git push origin master
```

## Deleting a Branch

Delete the branch locally:
```
$ git branch -d [BRANCH-NAME]
```

Then, delete the branch from remote:
```
$ git push origin --delete [BRANCH-NAME]
```