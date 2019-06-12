var Generator = require('yeoman-generator'),
    SfUtils = require('../utils/sfUtils');

module.exports = class extends Generator {


    constructor(args, opts) {
        super(args, opts);
        this.option('babel'); // This method adds support for a `--babel` flag
        this.sfUtils = new SfUtils(this.config);
    }

    async prompting() {
        this.props = await this.prompt([{
            type: 'checkbox',
            name: 'models',
            message: 'What models should be generated',
            choices: async () => await this.sfUtils.getDynamicModules()
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