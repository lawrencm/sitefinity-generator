using System;
using System.ComponentModel;
using System.Web.Mvc;
using <%= assemblyName %>.Application.Controllers.Base;
using <%= assemblyName %>.Application.Models.Interfaces;
using Telerik.Sitefinity.Frontend.Mvc.Infrastructure.Controllers;
using Telerik.Sitefinity.Frontend.Mvc.Infrastructure.Controllers.Attributes;
using Telerik.Sitefinity.Modules.Pages.Configuration;
using Telerik.Sitefinity.Mvc;
using Telerik.Sitefinity.Personalization;
using Telerik.Sitefinity.Web.UI;

namespace <%= assemblyName %>.Application.Controllers.<%= widgetName %>
{
    [EnhanceViewEngines]
    [ControllerToolboxItem(Name = "<%= widgetName %>_MVC", Title = "ToolboxTitle", SectionName = ToolboxesConfig.ContentToolboxSectionName,
        CssClass = WidgetIconCssClass)]
    [IndexRenderMode(IndexRenderModes.Normal)]
    public class <%= widgetName %>Controller : CacheDependencyController, ICustomWidgetVisualizationExtended, IPersonalizable
    {
        #region Properties

        /// <summary>
        /// Gets a value indicating whether the widget is empty.
        /// </summary>
        /// <value>
        ///   <c>true</c> if widget has a valid model; otherwise, <c>false</c>.
        /// </value>
        [Browsable(false)]
        public bool IsEmpty => Model.IsEmpty();

        /// <inheritdoc />
        public string WidgetCssClass => WidgetIconCssClass;

        /// <inheritdoc />
        public string EmptyLinkText => "Select a ToolboxTitle";

        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the name of the template that widget will display.
        /// </summary>
        /// <value></value>
        public string TemplateName { get; set; } = "Default";

        /// <summary>
        /// Gets the ToolboxTitle widget model.
        /// </summary>
        /// <value>
        /// The model.
        /// </value>
        [TypeConverter(typeof(ExpandableObjectConverter))]
        public virtual I<%= widgetName %>Model Model
        {
            get
            {
                if (this._model == null)
                    this._model = ControllerModelFactory.GetModel<I<%= widgetName %>Model>(this.GetType());

                return _model;
            }
        }

        #endregion

        #region Actions

        /// <summary>
        /// Renders the appropriate view depending on the <see cref="TemplateName" />
        /// </summary>
        /// <returns>
        /// The <see cref="ActionResult" />.
        /// </returns>
        public ActionResult Index()
        {
            var fullTemplateName = _templatePrefix + TemplateName;

            var viewModel = this.Model.GetViewModel();
            return View(fullTemplateName, viewModel);
        }

        /// <inheritDoc/>
        protected override void HandleUnknownAction(string actionName)
        {
            ActionInvoker.InvokeAction(ControllerContext, "Index");
        }

        #endregion

        #region Private fields and constants

        internal const string WidgetIconCssClass = "sfListitemsIcn sfMvcIcn";
        private readonly string _templatePrefix = "<%= widgetName %>.";
        private I<%= widgetName %>Model _model;
        protected override Type CachedObjectType => typeof(I<%= widgetName %>Model);

        #endregion
    }
}