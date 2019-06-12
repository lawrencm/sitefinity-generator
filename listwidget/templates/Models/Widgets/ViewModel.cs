using <%= assemblyName %>.Application.Controllers.<%= widgetName %>;
using Telerik.Sitefinity.Frontend.Mvc.Models;

namespace <%= assemblyName %>.Application.Models.Widgets.<%= widgetName %>
{
    /// <summary>
    /// The view model for the model of <see cref="<%= widgetName %>Controller"/>
    /// </summary>
    public class <%= widgetName %>ViewModel : ContentDetailsViewModel
    {
        public bool ShowHeading { get; set; }

        public string Heading { get; set; }
    }
}