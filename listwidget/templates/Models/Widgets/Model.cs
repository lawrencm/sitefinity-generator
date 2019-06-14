using <%= assemblyName %>.Application.Helpers;
using <%= assemblyName %>.Application.Models.Interfaces;


namespace <%= assemblyName %>.Application.Models.Widgets.<%= widgetName %>
{
    /// <summary>
    /// Provides API for working with items.
    /// </summary>
    public class <%= widgetName %>Model : I<%= widgetName %>Model
    {

        /// <inheritdoc />
        public string CssClass { get; set; }

        /// <inheritdoc />
        public bool ShowHeading { get; set; }

        /// <inheritdoc />
        public string OverrideHeading { get; set; }

        /// <inheritdoc />
         public string ProviderName { get; set; }
		 
        /// <inheritdoc />
        public string SelectedItem { get; set; }

        /// <inheritdoc />
        public string SelectedId { get; set; }

        /// <inheritdoc />
        // TODO link to specific type
        public string ItemType { get; set; } = "<%= itemType %>";


        /// <inheritdoc />
        public virtual <%= widgetName %>ViewModel GetViewModel()
        {
            if (IsEmpty())
                return null;

            var viewModel = new <%= widgetName %>ViewModel()
            {
                CssClass = this.CssClass,
                ShowHeading = this.ShowHeading,
                Heading = this.OverrideHeading,
                ItemId = this.SelectedId,

            };           

			//TODO put in any extra model to view model binding
			//viewModel.OverrideHeading = "etc"

			return viewModel;

            
        }

        public bool IsEmpty()
        {
            return false;
            //return string.IsNullOrEmpty(SelectedId) || !Guid.TryParse(SelectedId, out _);
        }
    }
}