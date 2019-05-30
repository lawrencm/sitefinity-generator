var fs = require('node-async-fs'),
    xml2js = require('xml2js'),
    axios = require('axios'),
    _ = require('lodash');

module.exports = class {

    constructor() {
        // this.getProjectFile();
        this.projectFile;
        this.base_url = "https://dev.sf.local";

        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

        axios.defaults.baseURL = "https://dev.sf.local/";
        axios.defaults.headers.common['Authorization'] = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSIsImtpZCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSJ9.eyJpc3MiOiJodHRwczovL2Rldi5zZi5sb2NhbC9TaXRlZmluaXR5L0F1dGhlbnRpY2F0ZS9PcGVuSUQiLCJhdWQiOiJodHRwczovL2Rldi5zZi5sb2NhbC9TaXRlZmluaXR5L0F1dGhlbnRpY2F0ZS9PcGVuSUQvcmVzb3VyY2VzIiwiZXhwIjoxNTU5MjA3ODEyLCJuYmYiOjE1NTkyMDQyMTIsImNsaWVudF9pZCI6InRlc3RBcHAiLCJzY29wZSI6Im9wZW5pZCIsInN1YiI6IkRlZmF1bHR8YjczNjVkZTgtMTE4My00ZTdkLWE5ZmYtMGM4YjIzNTllZDI3IiwiYXV0aF90aW1lIjoxNTU5MjA0MjExLCJpZHAiOiJpZHNydiIsImFtciI6WyJwYXNzd29yZCJdfQ.lsgQDN0pUJ1Q1Is4NsoG-bdnUeVtfjExkBpoZILB4JilmFCSscGRiEfIQWO7KsyGkH15DZKW_U8MWvoh094XtIj-0qJkXpJrTmQmZl2Mus4Xp8Lt39cIxsGIWRAZGu64g77OaUYEOrjjOduhFO4La80YcYeZ3bqgK5UMoJCcvXzueM6S0I-mDO24dbeNxgjFLRhzTJ7s0r6PMnXeMQAjsr9aAVJCuAJ5uX1I6sP9aH3sgsk_UT2nMK9fH9psVEeqgmOEK_HUFCC7V4z4Le38eR3PwyfaksnY1ybUkvuP0nW_XW51DefZIXtd8vGfXBIQXYiCFeNRUMkGcCMpVb2VoQ";
    
        this.modules = [];
    }


    


    async _getModules() {
        // Make a request for a user with a given ID
        return await axios.get(`/api/default/$metadata`)
            .then(async (response) => {
                //console.log(response.data);
                var parser = new xml2js.Parser();
                const json = await new Promise((resolve, reject) => {

                    parser.parseString(response.data, (err, result) => err ? reject(err) : resolve(result));
                }).then((result) => {

                    // console.log(JSON.stringify(result["edmx:Edmx"]["edmx:DataServices"][0]["Schema"]));

                    this.modules = result["edmx:Edmx"]["edmx:DataServices"][0]["Schema"];
                    return "foo"
                })


            })
            .catch(function (error) {
                console.log(error);
            });
        }

        async getDynamicModules(){
            await this._getModules();
            let dynamicModules = [];

            //console.log(this.modules)
            
            this.modules.forEach(module => {
                // console.log(module)

                if(module["$"]["Namespace"] && module["$"]["Namespace"].indexOf("Telerik.Sitefinity.DynamicTypes.Model") >=0){
                    var newModule = {};
                        newModule["name"] = module["$"].Namespace;
                        newModule["value"] = module.EntityType;
                        newModule["checked"] = true;
                        dynamicModules.push(newModule);
                }
            });

            // console.log(dynamicModules);
            // console.log(JSON.stringify(dynamicModules));
            return dynamicModules
        }
    
}