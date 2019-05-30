using <%= assemblyName %>.Application.Models.Widgets.<%= widgetName %>;

namespace <%= assemblyName %>.Application.Models.Interfaces
{
    public interface I<%= widgetName %>Model
    {
        /// <summary>
        /// Gets or sets the css class.
        /// </summary>
        string CssClass { get; set; }

        /// <summary>
        /// Gets or sets the option to show the heading
        /// </summary>
        bool ShowHeading { get; set; }

        /// <summary>
        /// Gets or sets the option to define a heading
        /// </summary>
        string OverrideHeading { get; set; }

        /// <summary>
        /// Gets the provider name
        /// </summary>
        string ProviderName { get; }

        /// <summary>
        /// Gets or sets the selected item object
        /// </summary>
        string SelectedItem { get; set; }

        /// <summary>
        /// Gets or sets the SelectedId
        /// </summary>
        string SelectedId { get; set; }

        /// <summary>
        /// Gets the view model.
        /// </summary>
        /// <returns></returns>
        <%= widgetName %>ViewModel GetViewModel();

        /// <summary>
        /// Checks if the model is empty.
        /// </summary>
        /// <returns></returns>
        bool IsEmpty();
    }
}