var Generator = require('yeoman-generator'),
  fs = require('node-async-fs'),
  xml2js = require('xml2js'),
  VsUtils = require('../utils/vsUtils'),
  SfUtils = require('../utils/sfUtils'),
  inquirer = require('inquirer'),
  getYoRcPath = require('get-yo-rc-path'),
  _ = require('lodash');



module.exports = class extends Generator {
  // The name `constructor` is important here



  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
    this.vsUtils = new VsUtils();
    this.sfUtils = new SfUtils(this.config);
  }

  // initializing() {
  //   this.composeWith(require.resolve('../setup'));

  // }
  /**
   * list of all the files to copy for this module
   */
  _private_getFiles() {
    var creds = this.config.get("promptValues");

    return [
      ['Models/Widgets/Model.cs', `Application/Models/Widgets/${creds.widgetName}/${creds.widgetName}Model.cs`, 'Compile'],
      ['Models/Widgets/ViewModel.cs', `Application/Models/Widgets/${creds.widgetName}/${creds.widgetName}ViewModel.cs`, 'Compile'],
      ['Models/Interfaces/IModel.cs', `Application/Models/Interfaces/I${creds.widgetName}Model.cs`, 'Compile'],
      ['Controllers/Controller.cs', `Application/Controllers/Widgets/${creds.widgetName}Controller.cs`, 'Compile'],
      ['Views/Default.cshtml', `ResourcePackages/${creds.resourcePackage}/MVC/Views/${creds.widgetName}/${creds.widgetName}.Default.cshtml`, 'Content'],
      ['Views/DesignerView.Simple.cshtml', `ResourcePackages/${creds.resourcePackage}/MVC/Views/${creds.widgetName}/DesignerView.Simple.cshtml`, 'Content'],
      ['Views/DesignerView.Simple.json', `ResourcePackages/${creds.resourcePackage}/MVC/Views/${creds.widgetName}/DesignerView.Simple.json`, 'Content'],
      ['Scripts/designerview-simple.js', `ResourcePackages/${creds.resourcePackage}/MVC/Scripts/${creds.widgetName}/designerview-simple.js`, 'Content']

    ]
  }

  _private_getToken() {
    console.log("getting the token");
  }


  /**
   * get the user account details from config or prompt for new ones
   */




  async prompting() {
    var creds = this.config.get("promptValues");

    this.props = await this.prompt([

      {
        type: "input",
        name: "widgetName",
        message: "Widget Name",
        store: true,
        default: _.startCase(this.appname) // Default to current folder name
      },
      {
        type: "input",
        name: "assemblyName",
        message: "Assembly name",
        store: true,
        when: () => !creds || !creds.assemblyName,
        default: "SitefinityStarterProject.Website"
      },

      {
        type: 'list',
        name: 'itemtypeModule',
        message: 'What module is the item type from',
        choices: await this.sfUtils.getDynamicModules(),
      },
      {
        type: 'list',
        name: 'itemType',
        message: 'What contenttypes',
        choices: (obj) => {
          var dynamicModels = [];
          obj.itemtypeModule.models.forEach(model => {
            var newModel = {};
            console.log(model)
            newModel["name"] = model.$.Name;
            newModel["value"] = `${obj.itemtypeModule.name}.${model.$.Name}`;
            newModel["checked"] = false;
            dynamicModels.push(newModel);
          });

          return dynamicModels;
        },
        store: true
      }, {
        type: 'list',
        name: 'resourcePackage',
        store: true,
        message: 'What resource packge should this belong to',
        choices: await this.vsUtils.getResourcePackages(),

      }
    ])




  }

  generateTests() {
    this.log("TODO - Generate some tests");
  }

  writing() {
    var prompts = this.config.get("promptValues");
    var data = {
      assemblyName: `${prompts.assemblyName}`,
      widgetName: `${prompts.widgetName}`,
      itemType: `${prompts.itemType}`
    }

    //write files
    this._private_getFiles().forEach(fileConf => {
      
      this.fs.copyTpl(
        this.templatePath(fileConf[0]),
        this.destinationPath(fileConf[1]),
        data
      );

      this.vsUtils.includeInProject(this.config,fileConf[1].replace(/\//g, "\\"),fileConf[2])
      //append item to the array
    });
   
    
    

  }
};