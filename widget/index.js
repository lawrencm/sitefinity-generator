var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.option('babel');
    }

    /**
     * get the project setup
     */
    async prompting() {
        await this.composeWith(require.resolve('../setup'))
    }

    /**
     * determine the widget type
     */
    async configuring() {
        this.props = await this.prompt([{
            type: 'list',
            name: 'widgettype',
            message: 'What kind of widget',
            choices: ["list", "navigation"]
        },
        {
            type: 'confirm',
            name: 'updateProject',
            store:true,
            message: 'Update the project file',
            default: true
        }])

        switch (this.props.widgettype) {
            case "list":
                this.composeWith(require.resolve('../listwidget'));
                break;
            default:
                this.log("There isnt a widget type defined for this yet.")
                break;
        }
    }


    writing(){
        this.composeWith(require.resolve('../contentviewmodels'));
    }

}