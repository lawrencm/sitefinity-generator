var Generator = require('yeoman-generator'),
    SfUtils = require('../utils/sfUtils');

module.exports = class extends Generator {


    constructor(args, opts) {
        super(args, opts);
        this.option('babel'); // This method adds support for a `--babel` flag
        this.sfUtils = new SfUtils(this.config);
    }

    async prompting() {

        var models = await this.sfUtils.getDynamicModules();

        this.props = await this.prompt([{
            type: 'checkbox',
            name: 'modules',
            message: 'What models should be generated',
            choices: models
        }, {
            type: 'checkbox',
            name: 'models',
            message: 'What contenttypes',
            choices: (obj) => {

                console.log(obj.modules);
                var dynamicModels = [];
                obj.modules.forEach(module => {
                    module.forEach(model=>{

                        var newModel = {};
                        newModel["name"] = model.$.Name;
                        newModel["value"] = model;
                        newModel["checked"] = false;
                        dynamicModels.push(newModel);


                    })
                });

                return dynamicModels;


                // x.forEach(mdl => {
                //     console.log(mdl)
    
                //     mdl.value.forEach(t=>{
                //         console.log("------------------------\n\n\n");
    
                //         console.log(t.$.Name);
                //         console.log("------------------------\n\n\n");
                //     })
                    
                // });
            }
        }])
    
    
    }

    writing() {

        var prompts = this.config.get("promptValues");

        var data = {
            assemblyName: `${prompts.assemblyName}`,
            widgetName: `${prompts.widgetName}`,
            models: {}
        }

        //write out the dynamic content view models
        this.props.models.forEach(models => {



            models.forEach(model => {
                
                data.ViewModel = {
                    props: {}
                }

                model.Property.forEach(property => {
                    var name = property.$.Name;
                    var o = {
                        "name": name,
                        "type": property.$.Type,
                    }
                    data.ViewModel["props"][name] = o
                });

                if ("NavigationProperty" in model) {
                    model.NavigationProperty.forEach(property => {
                        var name = property.$.Name;
                        var o = {
                            "name": name,
                            "type": property.$.Type,
                        }
                        data.ViewModel["props"][name] = o
                    });
                }

                console.log(data.ViewModel)
                data.ModelName = model.$.Name;

                this.fs.copyTpl(
                    this.templatePath('Models/Widgets/ContentModel.cs'),
                    this.destinationPath(`Application/Models/Widget/${data.widgetName}/${model.$.Name}ViewModel.cs`),
                    data
                )
                console.log(`\n\nCreate a view model for ${model.$.Name}`)
            });

        })
    }
}