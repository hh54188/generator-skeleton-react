const Generator = require("yeoman-generator");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const dependencies = require("./dependencies/dependencies");
const devDependencies = require("./dependencies/devDependencies");
const apolloDependencies = require("./dependencies/apolloDependencies");

module.exports = class extends Generator {
  constructor(props, opts) {
    super(props, opts);
  }
  // initializing() {
  //   // Your initialization methods (checking current project state, getting configs, etc)
  // }
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name:",
        // validate 函数可能在 windows 上失效？
        validate: input => {
          // 判断用户的输入是否为空
          if (!input) {
            this.log(" Sorry, project name is empty");
            return false;
          }

          // 判断用户想要创建的文件夹是否已经存在
          // 判断文件夹是否存在的方式有非常多种
          // https://stackoverflow.com/questions/4482686/check-synchronously-if-file-directory-exists-in-node-js
          // 但是作为自用的脚手架就简单判断了
          const targetPath = path.join(this.destinationRoot(), input);
          if (fs.existsSync && fs.existsSync(targetPath)) {
            this.log(" Sorry, project directory is already exist");
            return false;
          }
          return true;
        }
      },
      {
        type: "confirm",
        message: "Install ApolloClient packages? (Default: No)",
        name: "apollo",
        default: false
      },
      {
        type: "list",
        name: "tool",
        message: "Choose dependencies install tool:",
        default: "yarn",
        choices: ["yarn", "npm"]
      }
    ]).then(answers => {
      this.userConfig = answers;
      this.destinationRoot(answers.name);
    });
  }
  // configuring() {
  //   // Saving configurations and configure the project (creating .editorconfig files and other metadata files)
  // }
  // default() {
  //   // If the method name doesn’t match a priority, it will be pushed to this group.
  // }
  writing() {
    const copiedFiles = [
      "README.md",
      "webpack.config.common.js",
      "webpack.config.dev.js",
      "webpack.config.prod.js",
      ".gitignore",
      ".babelrc",
      "src",
      // 注意，这里无法复制 public 里的 dist 文件夹
      // 因为 dist 文件夹是空的，即使添加了 .keep 文件也不行
      // 所以只能添加一个 keep 文件
      "public"
    ];
    copiedFiles.forEach(fileName => {
      this.fs.copy(this.templatePath(fileName), this.destinationPath(fileName));
    });

    let finalDependencies = dependencies;
    if (this.userConfig.apollo) {
      finalDependencies = _.merge(finalDependencies, apolloDependencies);
    }

    const pkgJson = {
      name: this.userConfig.name,
      version: "0.0.1",
      scripts: {
        start: "npm run devServer",
        devServer: "webpack-dev-server --config webpack.config.dev.js"
      },
      dependencies: finalDependencies,
      devDependencies: devDependencies
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }
  // conflicts() {
  //   // Where conflicts are handled (used internally)
  // }
  install() {
    const { tool } = this.userConfig;
    if (tool === "npm") {
      this.npmInstall();
    } else if (tool === "yarn") {
      this.yarnInstall();
    }
  }
  // end() {
  //   // Called last, cleanup, say good bye, etc
  //   console.log("Goodbye");
  // }
};
