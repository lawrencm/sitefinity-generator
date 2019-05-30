var fs = require('node-async-fs'),
    xml2js = require('xml2js'),
    _ = require('lodash');

module.exports = class {

    constructor() {
        // this.getProjectFile();
        this.projectFile;

    }


    /**
     * Gets the cs project file and converts it to a json object
     */
    async getProjectFile() {
        console.log("getting project file");


        return await fs.readFile('./SitefinityWebApp.csproj')
            .then(async (data) => {
                var parser = new xml2js.Parser();
                const json = await new Promise((resolve, reject) => {
                    parser.parseString(data, (err, result) => err ? reject(err) : resolve(result));
                }).then((result) => {
                    // console.log("here")
                    this.projectFile = result
                    // console.log(result)
                    return result;
                })
            })

            .catch((err) => {
                console.log(err);
            });

        //this.projectFile = result;

    }


    async getAssemblyName() {
        console.log("Getting the Assembly name");
        await this.getProjectFile()
        // console.log(this.projectFile);

        var assembly = _.find(this.projectFile.Project.PropertyGroup, function (o) {
            // console.log(o)
            return o.AssemblyName != null;
        });

        console.log("assembly")
        return assembly.AssemblyName[0];
    }

    
    async getResourcePackages(){

        var choices =  fs.readdir("./ResourcePackages/")
        .then((items) =>{
            return items;
            // console.log(items);
        
            // for (var i=0; i<items.length; i++) {
            //     console.log(items[i]);
            // }
        })
        .catch((err) => {
            console.log(err);
        });

        return choices
    }
}