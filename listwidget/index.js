var Generator = require('yeoman-generator'),
  fs = require('node-async-fs'),
  xml2js = require('xml2js'),
  VsUtils = require('../utils/vsUtils'),
  SfUtils = require('../utils/sfUtils'),
  _ = require('lodash');

var vsUtils = new VsUtils();
var sfUtils = new SfUtils();

module.exports = class extends Generator {
  // The name `constructor` is important here



  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }





  // async getService(){
  //   // Make a request for a user with a given ID
  //   var modules = await sfUtils.getDynamicModules();
  //   // console.log(modules);
  // }


  _private_getFiles(){
    return [
      ['Models/Widgets/Model.cs', `Application/Models/Widget/${this.props.name}/${this.props.name}Model.cs`],
      ['Models/Widgets/ViewModel.cs',`Application/Models/Widget/${this.props.name}/${this.props.name}ViewModel.cs`],
      ['Models/Interfaces/IModel.cs',`Application/Models/Interfaces/I${this.props.name}Model.cs`],
      ['Controllers/Controller.cs', `Application/Controllers/${this.props.name}/${this.props.name}Controller.cs`],
      ['Views/Default.cshtml',`ResourcePackages/${this.props.resourcePackage}/MVC/Views/${this.props.name}/${this.props.name}.Default.cshtml`],
      ['Views/DesignerView.Simple.cshtml',`ResourcePackages/${this.props.resourcePackage}/MVC/Views/${this.props.name}/DesignerViewSimple.cshtml`],
      ['Views/DesignerView.Simple.json',`ResourcePackages/${this.props.resourcePackage}/MVC/Views/${this.props.name}/DesignerViewSimple.json`]

    ]
  }

  async prompting() {
    this.props = await this.prompt([{
        type: "input",
        name: "name",
        message: "Widget Name",
        default: this.appname // Default to current folder name
      },
      {
        type: 'checkbox',
        name: 'models',
        message: 'What models should be generated',
        choices: await sfUtils.getDynamicModules()
      },
      {
        type: 'list',
        name: 'resourcePackage',
        message: 'What resource pAckge should this belong to',
        choices: await vsUtils.getResourcePackages()
      }
    ]);

    //force string case
    this.props.name = _.startCase(this.props.name)

    // this.log("app name", this.props.name);

    this.props["assemblyName"] = await vsUtils.getAssemblyName();

  }


  getDymanicModelSchema(){
    this.log("TODO - use the sf api to generate the View Model");

    this.props.models.forEach(models => {
      models.forEach(model => {
        console.log(`\n\nCreate a view model for ${model.$.Name}`)
        model.Property.forEach(property => {
          console.log(`\tCreate the field ${property.$.Name} of type ${property.$.Type}`)
        });
      });
    });
  }

  generateTests(){
    this.log("TODO - Generate some tests");
  }

  writingFiles() {
    
    var data = {
      assemblyName: `${this.props.assemblyName}`,
      widgetName: `${this.props.name}`
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