/**
 * Created by jpsoroulas.
 */
define(['underscore', 'backbone', 'jquery', 'handlebars', 'templates', 'helper'], function (_, Backbone, $, Handlebars, JST, helper) {

    var endpointTemplate = JST['src/views/endpoint.hbs'];
    var endpointInfoTemplate = JST['src/views/endpoint-info.hbs'];
    var approveAction = helper.approveAction;
    var infoDialog = helper.infoDialog;

    return Backbone.View.extend({
        tagName: 'tr',
        template: endpointTemplate,
        infoDialog: infoDialog(),
        events: {
            'click .action-activate-endpoint': 'activate',
            'click .action-deactivate-endpoint': 'deactivate',
            'click .action-enable-notification': 'enableNotification',
            'click .action-disable-notification': 'disableNotification',
            'click .action-delete': 'erase',
            'click .action-history': 'history',
            'click td:first-child': 'showInfo'
        },

        initialize: function (options) {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'destroy', this._modelRemovedInfo);
            this.listenTo(this.model, 'change:active change:notify', this._attributeChangedInfo);
            this.listenTo(this.model, 'op:failed', this._operationFailedInfo);
            this.endpointHistory = options.endpointHistory;
        },

        //getEndpointId: function () {
        //    return this.$el.closest('tr').find('td:first-child').text();
        //},
        render: function () {
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            this.markEndpoints();
            return this;
        },

        markEndpoints: function () {
            this.$('.status-down, .status-unreachable').closest("tr").attr('class', 'erroneous-endpoint');
            this.$('.status-undetermined').closest("tr").attr('class', 'undetermined-endpoint');
            this.$('.status-up').closest("tr").attr('class', 'healthy-endpoint');
            this.$('.action-activate-endpoint').closest("tr").attr('class', 'inactive-endpoint');
        },

        activate: function (event) {
            this.model.doActivate(true);
        },

        deactivate: function (event) {
            this.model.doActivate(false);
        },

        enableNotification: function (event) {
            this.model.doNotify(true);
        },

        disableNotification: function (event) {
            this.model.doNotify(false);
        },

        erase: function (event) {
            var _self = this;
            var model = this.model;
            $.when(approveAction('Delete endpoint \'' + model.id + '\' ?').then(
                function () {
                    model.destroy({
                        wait: true,
                        error: function (model, response, options) {
                            _self._operationFailedInfo(model, response.responseJSON);
                        }
                    });
                }));
        },

        history: function (event) {
            console.log('click history');
            this.endpointHistory.render(this.model);
        },

        _attributeChangedInfo: function (model, value, options) {
            this.infoDialog.text('Property changed for \'' + model.id + '\'');
            this.infoDialog.dialog('open');
        },

        _modelRemovedInfo: function (model, value, options) {
            this.infoDialog.text('Endpoint \'' + model.id + '\' removed!');
            this.infoDialog.dialog('open');
        },

        _operationFailedInfo: function (model, err) {
            this.infoDialog.html('Operation for \'' + model.id + '\' failed!</br>' + err.message);
            this.infoDialog.dialog('open');
        },

        showInfo: function () {
            this.infoDialog.html(endpointInfoTemplate(this.model.attributes)).dialog('open');
            return false;
        }
    });

});