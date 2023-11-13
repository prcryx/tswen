#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs'
import path from 'path';
import { CliTemplate, WebTemplate } from './templates/index.js';

function createProject(projectName, ptype) {
  console.log(`Creating project : ${projectName}`);
  console.log("\n\n\nPlease wait...\n\n\n");

  const projectPath = path.join(process.cwd(), projectName);

  fs.mkdirSync(projectPath);
  process.chdir(projectPath);
  execSync('npm init -y');
  execSync('npm install --save-dev typescript ts-node');
  execSync('npx tsc --init');

  execSync('npm install express @types/express');
  const indexFileContent = ptype== "-web"? WebTemplate() : ptype=="-cli"?CliTemplate():"";

  fs.writeFileSync(path.join(projectPath, 'index.ts'), indexFileContent.trim());

  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.scripts = {
    start: 'ts-node index.ts',
    build: 'tsc',
  };
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log('Project setup complete!');
}

// Get project name from command line arguments
if ( process.argv[2] =="--help" || "-h"){
  console.log(`
  tswen: node tswen <project_name> [Options]
         A simple script to genrate a minimalistic typescript project

  Options:
  -cli    will generate a cli program
  -web    will create a minimal backend program

  --help, -h  will print tswen command line options
  `)
}else{
  const projectName = process.argv[2];
  const ptype = process.argv[3];

  if (!projectName) {
    console.error(`Please provide a project name.\n You can also choose type of project(cli/backend)`);
    process.exit(1);
  }

createProject(projectName, ptype);
}


