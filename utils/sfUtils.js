var fs = require('node-async-fs'),
    xml2js = require('xml2js'),
    axios = require('axios'),
    _ = require('lodash');

module.exports = class {

    constructor(config) {
        // this.getProjectFile();
        
        this.projectFile;
        this.config = config
        this.params = config.get("promptValues");
        this.modules = [];


        if(this.params){
            this.base_url = this.params.url || "";
            axios.defaults.baseURL = this.params.url || "";
        }else{
            this.base_url = "";
            axios.defaults.baseURL = "";
        }
        
        //ignore invalid certs - for self signed certs
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        
        //set the default auth token
        var at = this.config.get('token')?this.config.get('token')["access_token"]:null
        if (at){
            axios.defaults.headers.common['Authorization'] = `Bearer ${at}`;
        }  
    }


    //login to sitefinity
    async login(newConf) {

        var expiryTime = this.config.get("tokenexpiry"); 
        var t = new Date().getTime();

        if (!expiryTime || t > expiryTime) {
            console.log("Auth token has expired. Refreshing now");
            return await this._getAuthToken(newConf);
        }
        return
    }


    /**
     * returns of list of dynamic content modules in the CMS
        is used to generate models for strong typing
     */

    async getDynamicModules() {
        await this._getModules();
        let dynamicModules = [];
        this.modules.forEach(module => {
            if(module["$"]["Namespace"] && module["$"]["Namespace"].indexOf("Telerik.Sitefinity.DynamicTypes.Model") >=0){
                
                // console.log(JSON.stringify(module))
                
                var newModule = {};
                newModule["name"] = module["$"].Namespace;
                newModule["value"] = {name:module["$"].Namespace,models:module.EntityType};
                newModule["checked"] = false;
                // console.log(newModule)
                dynamicModules.push(newModule);

            }
        });

        return dynamicModules
        
    }




//PRIVATE METHODS


async _getAuthToken(creds) {

    //var creds = this.config.get("promptValues");
    var username = creds["username"];
    var password = creds["password"];

    this.base_url = creds.url || "";
    axios.defaults.baseURL = creds.url || "";


    var data = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&grant_type=password&scope=openid&client_id=yoman&client_secret=secret`;

    return await axios.post(`/Sitefinity/Authenticate/OpenID/connect/token`, data, {
            headers: {
                'Content-Type': "application/x-www-form-urlencoded",
            }
        })
        .then(async (response) => {
            // console.log(response.data);
            //clone the token
            var token = Object.assign(response.data, {})

            //set expiry time
            var t = new Date();
            t.setSeconds(t.getSeconds() + response.data.expires_in);

            this.config.set("token", token)
            this.config.set("tokenexpiry", t.getTime())
            

            axios.defaults.headers.common['Authorization'] = `Bearer ${token.access_token}`;

            return true
        })
        .catch(function (error) {
            console.log(error);
            return false;
        });
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

                // console.log(JSON.stringify(result));
                // console.log(JSON.stringify(result["edmx:Edmx"]["edmx:DataServices"][0]["Schema"]));

                this.modules = result["edmx:Edmx"]["edmx:DataServices"][0]["Schema"];
                return "foo"
            })


        })
        .catch(function (error) {
            // console.log(error);
        });
}
}