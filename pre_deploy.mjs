import fs from 'fs-extra';

const DeployPath = './deploy';

async function mkdirDeploy() {
  if (!await fs.pathExists(DeployPath)) {
    await fs.mkdirs(DeployPath);
    console.log(` >> mkdir ${DeployPath}`)
  }
}
mkdirDeploy().then((_) => console.log('1. mkdirDeploy'));

async function checkWebJS() {
  const WebJS = `${DeployPath}/web.js`;
  if (!await fs.pathExists(WebJS)) {
    const data = `console.log('Server Start at ', new Date().toLocaleTimeString('ko-kr'));
require('./dist/main');
`
    fs.writeFileSync(WebJS, data)
    console.log(` >> write ${WebJS}`)
  }
}
checkWebJS().then((_) => console.log('2. checkWebJS'))

//  .prod.env 체크
async function checkProdEnv() {
  const prodEnv = '.prod.env';
  if (!await fs.pathExists(prodEnv)) {
    const Source = '.dev.env';
    const Dest = `./deploy/${prodEnv}`;
    await fs.copy(Source, Dest);
    console.log(` >> copy ${Source} to ${Dest}`)
  }
}
checkProdEnv().then((_) => console.log("3 checkProdEnv"))


//  .gitignore 체크
async function checkGitIgnore() {
  const GitIgnore = `${DeployPath}/.gitignore`;
  if (!await fs.pathExists(GitIgnore)) {
    const data = `/node_modules
.DS_Store
/.idea
.vscode/*
`
    fs.writeFileSync(GitIgnore, data)
    console.log(` >> write ${GitIgnore}`)
  }
}
checkGitIgnore().then((_) => console.log("4 .checkGitIgnore"))

async function distCopy() {
  const Dest = './deploy/dist';
  const Source = 'dist';

  await fs.remove(Dest);
  await fs.copy(Source, Dest);
  console.log(` >> copy ${Source} to ${Dest}`)
}
distCopy().then((_) => console.log("5. distCopy"));

//  package.json 업데이트
async function updatePackageJson() {
  const Dest = './deploy/package.json';
  const Source = 'package.json';

  const packages = fs.readJSONSync(Source)
  delete packages.scripts
  delete packages.devDependencies
  delete packages.jest

  await fs.remove(Dest);
  fs.writeJsonSync(Dest, packages);
  console.log(` >> update ${Dest}`)
}
updatePackageJson().then((_) => console.log("6. updatePackageJson"));