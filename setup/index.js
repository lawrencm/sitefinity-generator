var Generator = require('yeoman-generator'),
  VsUtils = require('../utils/vsUtils'),
  SfUtils = require('../utils/sfUtils'),
  _ = require('lodash');

module.exports = class extends Generator {

    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
        // Next, add your custom code
        this.option('babel'); // This method adds support for a `--babel` flag
        this.vsUtils = new VsUtils();
        this.sfUtils = new SfUtils(this.config);
      }
    
      async prompting() {

        var creds = this.config.get("promptValues");
        this.props = await this.prompt([
          {
            type: "input",
            name: "url",
            message: "Sitefinity base url",
            default: "https://dev.sf.local",
            store: true,
            when: () => !creds || !creds.url
          },
          {
            type: "input",
            name: "username",
            message: "Sitefinity username",
            store: true,
            when: () => !creds || !creds.username
          },
          {
            type: 'password',
            name: 'password',
            message: 'Please enter your password ',
            when: () => !creds || !creds.password,
            store: true
          },
          {
            type: "input",
            name: "client_name",
            message: "Sitefinity client name",
            default: "yoman",
            store: true,
            when: () => !creds || !creds.client_name
          },
          {
            type: "input",
            name: "client_secret",
            message: "Sitefinity client secret",
            default: "secret",
            store: true,
            when: () => !creds || !creds.client_secret
          },      
        ])
        
        // console.log(this.props)
        // console.log(this.config.get("promptValues"));
   
        var newConf = Object.assign(this.props,this.config.get("promptValues"))
        await this.sfUtils.login(newConf)

    }
}