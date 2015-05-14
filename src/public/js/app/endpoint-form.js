/**
 * Created by jpsoroulas.
 */
define(['underscore', 'jquery', 'backbone', 'templates', 'handlebars', 'helper', 'jquery-validate'], function (_, $, Backbone, JST, Handlebars, helper) {

    var infoDialog = helper.infoDialog;
    var dialogDefaults = helper.dialogDefaults;

    return Backbone.View.extend({
        el: '#endpoint-form-dialog',
        template: JST['src/views/endpoint-form.hbs'],
        strategies: [],
        endpointsModel: void 0,
        infoDialog: infoDialog(),
        events: {
            //'change #endpoint-type' : 'selectType',
            'click #activation-state': 'activate',
            'click #notification': 'notify'
        },

        initialize: function (options) {
            var _self = this;
            this.endpointsModel = options.endpointsModel;
            $.get('/resolution-strategies', function (response, status, jqXHR) {
                _self.strategies = response;
            }).fail(function () {
                _self.infoDialog.text('Retrieve resolution strategies failed.');
                _self.infoDialog.dialog('open');
            }).then(function () {
                _.bindAll(_self, 'render');
                _self.render();
            });
        },

        render: function () {
            var _self = this;
            this.$el.dialog(_.defaults({
                width: 260,
                autoOpen: true,
                title: "New Endpoint",
                buttons: {
                    'OK': function () {
                        _self.save();
                    },
                    'CANCEL': function () {
                        $(this).dialog('close');
                    }
                }
            }, dialogDefaults));
            var html = this.template({
                strategies: this.strategies
            });
            this.$el.html(html);
            this.$('#endpoint-type').selectmenu({
                select: function (event, ui) {
                    _self.fieldsVisibility(ui.item.value);
                }
            });
            this.$('#activation-state-label').attr('aria-pressed', 'false');
            this.$('#activation-state').button();
            this.$('#notification-label').attr('aria-pressed', 'false');
            this.$('#notification').button();
            this.fieldsVisibility('socket');
            //this.delegateEvents(this.events);
            return this;
        },

        save: function () {
            var infoDialog = this.infoDialog;
            var form = this.$el.find('form');
            var validator = form.validate({
                rules: {
                    port: {
                        required: false,
                        number: true
                    }
                },
                messages: {
                    'endpoint-id': {
                        required: 'Enter the endpoint id'
                    },
                    port: {
                        number: 'Enter a valid port number'
                    }
                },
                invalidHandler: function () {
                    var msg = _.chain([]);
                    _.each(validator.errorList, function (error) {
                        msg
                            //.push(error.element.name)
                            //.push(': ')
                            .push(error.message);
                    });
                    //infoDialog.dialog('option', 'title', 'Validation errors');
                    infoDialog.html(msg.value().join('</br>'));
                    infoDialog.dialog('open');
                },
                // do not show validation errors
                errorPlacement: function (error, element) {
                }
            });

            // triggers the validation
            if (!form.valid()) {
                return;
            }

            var endpoint = {
                id: this.$('#endpoint-id').val(),
                desc: this.$('#desc').val(),
                type: this.$('#endpoint-type').val(),
                host: this.$('#host').val(),
                port: this.$('#port').val(),
                url: this.$('#url').val(),
                resolutionStrategy: this.$('#resolution-strategy').val(),
                active: this.$('#activation-state').is(':checked'),
                notify: this.$('#notification').is(':checked')
            };

            this.endpointsModel.create(endpoint, {
                type: 'POST',
                wait: true,
                error: function (model, response, options) {
                    var respJSON = response.responseJSON;
                    var msg = _.chain([respJSON.message]);
                    _.each(respJSON.errors, function (error) {
                        msg.push(error)
                            .push('\n');
                    });
                    msg = msg.value().join('</br>');
                    infoDialog.html('Endpoint creation \'' + model.id + '\' not completed: </br>' + msg);
                    infoDialog.dialog('open');
                }
            });
            this.$el.dialog('close');
        },

        activate: function (event) {
            var target = $(event.target);
            var text = target.is(':checked') ? 'Active' : 'Inactive';
            target.button('option', 'label', text);
        },

        notify: function (event) {
            var target = $(event.target);
            var text = target.is(':checked') ? 'Notification enabled' : 'Notification disabled';
            target.button('option', 'label', text);
        },

        //selectType: function(event) {
        //    var type = $(event.target).find(":selected");
        //    this.fieldsVisibility(type.val());
        //},

        fieldsVisibility: function (selected) {
            if ('socket' === selected) {
                $('.socket-enabled').removeClass('hidden');
                $('.http-enabled').addClass('hidden');
            } else if ('http' === selected) {
                $('.http-enabled').removeClass('hidden');
                $('.socket-enabled').addClass('hidden');
            } else {
                throw new Error('Can not handle endpoint type: ' + selected);
            }
        }
    });


});