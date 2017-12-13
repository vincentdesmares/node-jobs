[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Build Status](https://travis-ci.org/vincentdesmares/node-jobs.svg?branch=master)](https://travis-ci.org/vincentdesmares/node-jobs)

# node-jobs

Jobs scheduler, manager and frontend tool

What does it do?

It allows you to setup execution pipelines and run them.

## Table of Contents

* [Install](#install)
* [Project References](#project-references)

## Install

```bash
apt-get install git curl
```

_node & npm & yarn_

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
nvm install 8
nvm use 8
```

Get the project

```bash
git clone git@github.com:vincentdesmares/node-procgen-editor.git
cd node-procgen-editor
yarn
yarn start
```

## Starting

```bash
yarn start-all
```

A page should open in your browser at localhost:3000, then you can open:

```
http://localhost:8080/graphiql
```

To be able to discover the project schema.

## Be able to run bin files from the local node_modules folder

Generating a new test

```bash
vim ~/.bashrc
#Add at the end of the file:
alias npm-exec='PATH=$(npm bin):$PATH'
npm-exec
:wq #Then save and quit
source ~/.bashrc
```

## TODO list

* [x] Add pipelines instead of scenes
* [ ] Make batches work (with status "stashed")
* [ ] Delete old jobs when re-assigning them to a scene scenario.
* [ ] plop

## Project References

[Create React App](https://github.com/facebookincubator/create-react-app)
