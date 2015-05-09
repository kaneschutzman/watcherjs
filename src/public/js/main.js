$(function () {
    $(document).tooltip();

    Handlebars.registerHelper('ifEquals', function (o1, o2, options) {
        if (o1 === o2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    var endpointTemplate = JST['src/views/endpoint.hbs'];
    var endpointsTemplate = JST['src/views/endpoints.hbs'];
    var endpointInfoTemplate = JST['src/views/endpoint-info.hbs'];
    var endpointFormTemplate = JST['src/views/endpoint-form.hbs'];

    var dialogDefaults = {
        autoOpen: false,
        show: {
            effect: "clip"
        },
        hide: {
            effect: "clip"
        }
    };

    var infoDialog = function () {
        var $dialog = $('#info-dialog').dialog(_.defaults({
            resizable: false,
            width: 'auto',
            buttons: {
                "OK": function () {
                    $(this).dialog("close");
                }
            }
        }, dialogDefaults));
        return _.extend($dialog, Backbone.Events);
    };

    var approveAction = function (message) {
        var $dialog = $('#confirm-dialog').dialog(dialogDefaults);
        return (function () {
            var def = $.Deferred();
            $dialog.dialog('option', 'buttons',
                {
                    "OK": function () {
                        def.resolve();
                        $(this).dialog('close');
                    },
                    "Cancel": function () {
                        def.reject();
                        $(this).dialog('close');
                    }
                });
            if (message) {
                $dialog.html(message);
            }
            $dialog.dialog('open');
            return def.promise();
        })();
    };

    var EndpointModel = Backbone.Model.extend({
            //url: '/endpoint',
            parse: function (endpoint) {
                var timestamp = moment(endpoint.timestamp);
                var since = moment(endpoint.since);
                endpoint.timestamp = timestamp.format('MMMM Do YYYY, h:mm:ss');
                endpoint.since = moment.duration(timestamp.diff(since)).format('d[d],h[h]:m[m]:s[s]');
                return endpoint;
            },

            doActivate: function (activate) {
                var model = this;
                var settings = {
                    url: '/endpoints/' + this.id + '/activate',
                    success: function (response, status, jqXHR) {
                        model.set({
                            active: response.active,
                            status: response.status
                        });
                    }
                };
                return this._doChangeEndpointState(settings, activate, model, 'op:activation:failed');
            },

            doNotify: function (notify) {
                var model = this;
                var settings = {
                    url: '/endpoints/' + this.id + '/notify',
                    success: function (response, status, jqXHR) {
                        model.set({
                            notify: response.notify
                        });
                    }
                };
                return this._doChangeEndpointState(settings, notify, model, 'op:notify:failed');
            },

            _doChangeEndpointState: function (settings, enable, model) {
                var _settings = {
                    error: function (jqXHR, status, error) {
                        console.log('Can not change endpoint state: ' + error);
                        model.trigger('op:failed', model);
                    }
                };
                settings.type = enable ? 'POST' : 'DELETE';
                return $.ajax(_.extend(settings, _settings));
            }
        }
    );

    var EndpointView = Backbone.View.extend({
        tagName: 'tr',
        template: endpointTemplate,
        infoDialog: infoDialog(),
        events: {
            'click .action-activate-endpoint': 'activate',
            'click .action-deactivate-endpoint': 'deactivate',
            'click .action-enable-notification': 'enableNotification',
            'click .action-disable-notification': 'disableNotification',
            'click .action-delete': 'erase',
            'click td:first-child': 'showInfo'
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'destroy', this._modelRemovedInfo);
            this.listenTo(this.model, 'change:active change:notify', this._attributeChangedInfo);
            this.listenTo(this.model, 'op:failed', this._operationFailedInfo);
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
            $.when(approveAction('Delete endpoint ' + model.id + ' ?').then(
                function () {
                    model.destroy({
                        wait: true,
                        error: _.bind(_self._operationFailedInfo, _self, model)
                    });
                }));
        },

        _attributeChangedInfo: function (model, value, options) {
            this.infoDialog.text('Attribute changed for \'' + model.id + '\'');
            this.infoDialog.dialog('open');
        },

        _modelRemovedInfo: function (model, value, options) {
            this.infoDialog.text('Endpoint \'' + model.id + '\' removed!');
            this.infoDialog.dialog('open');
        },

        _operationFailedInfo: function (model) {
            this.infoDialog.text('Operation for \'' + model.id + '\' failed!');
            this.infoDialog.dialog('open');
        },

        showInfo: function () {
            this.infoDialog.html(endpointInfoTemplate(this.model.attributes)).dialog('open');
            return false;
        }
    });

    var EndpointsModel = Backbone.Collection.extend({
        model: EndpointModel,
        url: '/endpoints'
    });

    var EndpointsView = Backbone.View.extend({
        el: '#endpoints-table',
        //tagName: 'div',
        template: endpointsTemplate,

        initialize: function () {
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'remove', this.render);
            this.listenTo(this.collection, 'add', this.render);
        },

        render: function () {
            this.$el.empty();
            var endpoints = this.collection.models;
            var html = this.template(this._computeStats(endpoints));
            this.$el.html(html);
            var subView = document.createDocumentFragment();
            _.each(endpoints, function (endpoint) {
                var endpointView = new EndpointView({model: endpoint});
                subView.appendChild(endpointView.render().el);
            }, this);
            this.$el.find('tbody').append(subView);
            return this;
        },

        _computeStats: function (endpointModels) {
            var total = endpointModels.length,
                statusUp = 0, statusErr = 0, statusUndet = 0,
                upRatio = 100, errRatio = 0;
            _.each(endpointModels, function (model) {
                var status = model.get('status');
                if ('up' === status) {
                    statusUp++;
                } else if ('undetermined' === status) {
                    statusUndet++;
                } else {
                    statusErr++;
                }
            });
            if (total > 0) {
                upRatio = ((statusUp / total) * 100).toFixed(1);
                errRatio = ((statusErr / total) * 100).toFixed(1);
            }
            return {
                'total': total,
                'statusUp': statusUp,
                'statusErr': statusErr,
                'statusUndet': statusUndet,
                'upRatio': upRatio,
                'errRatio': errRatio
            };
        }
    });

    var endpointsModel = new EndpointsModel();
    var endpointsView = new EndpointsView({
        collection: endpointsModel
    });
    endpointsModel.fetch({reset: true});

    var EndpointFormView = Backbone.View.extend({
        el: '#endpoint-form-dialog',
        template: endpointFormTemplate,
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
                error: function (model, response, options) {
                    var errors = response.responseJSON.errors;
                    var msg = _.chain([]);
                    _.each(errors, function (error) {
                        msg.push(error)
                            .push('\n');
                    });
                    msg = msg.value().join('</br>');
                    infoDialog.html('Endpoint creation \'' + model.id + '\' failed: </br>' + msg);
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

    $('#add-endpoint').click(function () {
        new EndpointFormView({
            endpointsModel: endpointsModel
        });
        return false;
    });

    var refreshErrorDialog = infoDialog();

    function refreshData() {
        endpointsModel.fetch({
            //reset: true,
            success: function () {
                refreshErrorDialog.dialog('close');
                endpointsView.render();
            },
            error: function (endpoints, response) {
                if (0 == response.status) {
                    refreshErrorDialog.text('Wait the connection to be restored, or refresh the page by pressing F5.');
                } else {
                    refreshErrorDialog.text('Error while processing the request: ' + response.statusText);
                }
                refreshErrorDialog.dialog('open');
            }
        });
    }

    setInterval(refreshData, 30000);
});
