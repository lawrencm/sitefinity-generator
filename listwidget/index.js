var Generator = require('yeoman-generator'),
  fs = require('node-async-fs'),
  xml2js = require('xml2js'),
  VsUtils = require('../utils/vsUtils'),
  SfUtils = require('../utils/sfUtils'),
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
    return [
      ['Models/Widgets/Model.cs', `Application/Models/Widget/${this.props.widgetName}/${this.props.widgetName}Model.cs`],
      ['Models/Widgets/ViewModel.cs', `Application/Models/Widget/${this.props.widgetName}/${this.props.widgetName}ViewModel.cs`],
      ['Models/Interfaces/IModel.cs', `Application/Models/Interfaces/I${this.props.widgetName}Model.cs`],
      ['Controllers/Controller.cs', `Application/Controllers/${this.props.widgetName}/${this.props.widgetName}Controller.cs`],
      ['Views/Default.cshtml', `ResourcePackages/${this.props.resourcePackage}/MVC/Views/${this.props.widgetName}/${this.props.widgetName}.Default.cshtml`],
      ['Views/DesignerView.Simple.cshtml', `ResourcePackages/${this.props.resourcePackage}/MVC/Views/${this.props.widgetName}/DesignerViewSimple.cshtml`],
      ['Views/DesignerView.Simple.json', `ResourcePackages/${this.props.resourcePackage}/MVC/Views/${this.props.widgetName}/DesignerViewSimple.json`]
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
        default: async () => await this.vsUtils.getAssemblyName()
      },
      {
        type: 'list',
        name: 'resourcePackage',
        store: true,
        message: 'What resource pAckge should this belong to',
        choices: await this.vsUtils.getResourcePackages(),
        when: () => !creds || !creds.resourcePackage

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
    }



    this._private_getFiles().forEach(fileConf => {
      this.fs.copyTpl(
        this.templatePath(fileConf[0]),
        this.destinationPath(fileConf[1]),
        data
      );
    });


  }
};