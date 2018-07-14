const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(props, opts) {
    super(props, opts);
  }
  // sample() {
  //   this.log("sample");
  // }
  // initializing() {
  //   // Your initialization methods (checking current project state, getting configs, etc)
  //   this.log("initializing");
  // }
  prompting() {
    // Where you prompt users for options (where you’d call this.prompt())
    return this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name:",
        store: true
      },
      {
        type: "list",
        name: "tool",
        message: "Choose dependencies install tool:",
        default: "yarn",
        choices: ["yarn", "npm"],
        store: true
      },
      {
        type: "list",
        name: "architecture",
        message: "Choose project architecture:",
        default: "redux",
        choices: ["redux", "mobx"],
        store: true
      }
    ]).then(answers => {
      this.destinationRoot(answers.name);
    });
  }
  // configuring() {
  //   // Saving configurations and configure the project (creating .editorconfig files and other metadata files)
  //   this.log("configuring");
  // }
  // default() {
  //   // If the method name doesn’t match a priority, it will be pushed to this group.
  //   this.log("default");
  // }
  writing() {
    // Where you write the generator specific files (routes, controllers, etc)
    const pkgJson = {
      devDependencies: {
        eslint: "^3.15.0"
      },
      dependencies: {
        react: "^16.2.0"
      }
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }
  // conflicts() {
  //   // Where conflicts are handled (used internally)
  //   this.log("conflicts");
  // }
  install() {
    // Where installations are run (npm, bower)
    // this.npmInstall();
    this.yarnInstall();
  }
  // end() {
  //   // Called last, cleanup, say good bye, etc
  //   this.log("Goodbye");
  // }
};
