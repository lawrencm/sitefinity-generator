var Generator = require('yeoman-generator'),
  fs = require('node-async-fs'),
  xml2js = require('xml2js'),
  VsUtils = require('../utils/vsUtils'),
  SfUtils = require('../utils/sfUtils'),
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
    }



    var prjCompileStrings = [];
    var prjContentStrings = [];

    this._private_getFiles().forEach(fileConf => {
      this.fs.copyTpl(
        this.templatePath(fileConf[0]),
        this.destinationPath(fileConf[1]),
        data
      );

      //append to prjString
      console.log(fileConf[2])
      if (fileConf[2] == "Compile") {
        prjCompileStrings.push(`<Compile Include="${fileConf[1].replace(/\//g, "\\")}" />`)
      } else if (fileConf[2] == "Content") {
        prjContentStrings.push(`<Content Include="${fileConf[1].replace(/\//g, "\\")}" />`)
      }

    });

    console.log(prjCompileStrings)
    console.log(prjContentStrings)


    if(prompts.updateProject){

    


    //update the dependency injection file
    //var path = "/path/to/file.html",
    getYoRcPath.dir().then((yoRcDir) => {

      //append to the Denpendency INjector
      var diPath = `${yoRcDir}\\Application\\DI\\Modules\\ModelsModule.cs`
      this.fs.copy(diPath, diPath, {
        process: (content) => {
          var newString = `
          
            Bind<I${data.widgetName}Model>().To<${data.widgetName}Model>();

            //yeoman insert above

          `;
          var regEx = new RegExp('//yeoman insert above', 'g');
          var newContent = content.toString().replace(regEx, newString);
          return newContent;
        }
      });


      // include files in project file
      var prjPath = `${yoRcDir}\\SitefinityStarterProject.Website.csproj`
      this.fs.copy(prjPath, prjPath, {
        process: (content) => {

          var newCompileString = `
          
          <!-- start of ${data.widgetName} compile includes -->
          ${prjCompileStrings.join('\n')}
          <!-- end of ${data.widgetName} compile includes -->
          
          <!-- END YEOMAN COMPILE INCLUDES -->
          `


          var newContentString = `
          
          <!-- start of ${data.widgetName} content includes -->
          ${prjContentStrings.join('\n')}
          <!-- end of ${data.widgetName} content includes -->
          
          <!-- END YEOMAN CONTENT INCLUDES -->
          `


          var cplRegEx = new RegExp('<!-- END YEOMAN COMPILE INCLUDES -->', 'g');
          var cntRegEx = new RegExp('<!-- END YEOMAN CONTENT INCLUDES -->', 'g');

          var newContent = content.toString().replace(cplRegEx, newCompileString).replace(cntRegEx, newContentString);;
          return newContent;
        }
      });
   





    });

  }
  }
};