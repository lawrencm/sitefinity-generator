var Generator = require('yeoman-generator'),
  fs = require('node-async-fs'),
  getYoRcPath = require('get-yo-rc-path'),
  _ = require('lodash');



module.exports = class extends Generator {
  // The name `constructor` is important here



  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }

  writing() {

    var prompts = this.config.get("promptValues");


    var data = {
      assemblyName: `${prompts.assemblyName}`,
      widgetName: `${prompts.widgetName}`,
      itemType: `${prompts.itemType}`
    }


    //get the current project strings from config
    var prjCompileStrings = this.config.get("prjCompileStrings");
    var prjContentStrings = this.config.get("prjContentStrings");

    
    if (prompts.updateProject) {

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
    return

  }
};