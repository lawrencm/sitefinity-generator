using <%= assemblyName %>.Application.Helpers;
using <%= assemblyName %>.Application.Models.Interfaces;


namespace <%= assemblyName %>.Application.Models.Widgets.<%= widgetName %>
{


    public class <%= ModelName %>ContentModel 
    {
    <% Object.keys(ViewModel.props).forEach(function(key){ 
        
    var t;
    var m = ViewModel.props[key]
    switch (  m.type ) { 
        case "Edm.String": 
            t="string"
            break;
        case "Edm.DateTimeOffset":
            t="DateTime"
            break
        case "Telerik.Sitefinity.Libraries.Model.Image": 
            t="ImageItemViewModel"
            break;
        default:
            t=m.type
            break;
    

     } %>
     public <%= t %>  <%= m.name %> { get; set; }
     <% }) %>

    }
}