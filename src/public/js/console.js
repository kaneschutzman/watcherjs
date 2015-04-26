/**
 * Created by jpsoroulas.
 */
$(function () {
    // Activate tooltips
    //--------------------------------------------------------------
    $(document).tooltip();

    Handlebars.registerHelper('ifEquals', function (o1, o2, options) {
        if (o1 === o2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    // An ajax template helper function
    //--------------------------------------------------------------
    function doAjaxPostTemplate(target, data, errorMsg) {
        var info = $('#info-dialog');
        return $.post(target, data, function (resp, status) {
            info.text(resp);
        }).fail(function (jqXHR, status, error) {
            info.text(errorMsg);
        }).always(function () {
            // In response to successful transaction, arguments are same as .done()
            // (ie. a = data, b = jqXHR) and for failed transactions the arguments
            // are same as .fail() (ie. a = jqXHR, b = errorThrown).
            info.dialog('option', 'title', 'Info');
            info.dialog('open');
        });
    }

    // Handlebars templates compilation
    //--------------------------------------------------------------
    //var endpointsLayout = $('#endpoints-table-layout').html();
    //var endpointsCompiled = Handlebars.compile(endpointsLayout);
    var endpointsCompiled = JST['src/views/endpoints-table.hbs'];
    var addEndpointCompiled = JST['src/views/add-endpoint.hbs'];
    var showEndpointCompiled = JST['src/views/show-endpoint.hbs'];

    // Define dialogs
    //--------------------------------------------------------------
    // Dialogs common options
    var dialogDefaults = {
        autoOpen: false,
        show: {
            effect: "clip"
        },
        hide: {
            effect: "clip"
        }
    };

    // Connection lost dialog
    $('#connection-lost-dialog').dialog(_.defaults({
        width: 250,
        buttons: {
            "Ok": function () {
                $(this).dialog("close");
            }
        }
    }, dialogDefaults));

    // Information dialog
    $('#info-dialog').dialog(_.defaults({
        resizable: false,
        width: 'auto',
        buttons: {
            "Ok": function () {
                $(this).dialog("close");
            }
        }
    }, dialogDefaults));

    // Delete endpoint confirmation dialog
    $('#delete-confirm-dialog').dialog(_.defaults({
        resizable: false,
        width: 'auto',
        buttons: {
            'Yes': function () {
                var id = $(this).data('id');
                var action = $(this).data('action');
                var params = _.defaults({id: id}, action.params);
                doAjaxPostTemplate(action.url, params,
                    action.msgOnFail).then(refreshData);
                $(this).dialog('close');
            },
            'No': function () {
                $(this).dialog('close');
            }
        }
    }, dialogDefaults));

    // Add endpoint confirmation dialog
    $('#add-endpoint-dialog').dialog(_.defaults({
        width: 260,
        buttons: {
            'Ok': function () {
                var _self = $(this);
                var info = $('#info-dialog');

                var form = $('#add-endpoint-form');
                var validator = form.validate({
                    rules: {
                        port: {
                            required: false,
                            number: true
                        }
                    },
                    invalidHandler: function () {
                        var msg = _.chain([]);
                        _.each(validator.errorList, function (error) {
                            msg.push(error.element.name)
                                .push(': ')
                                .push(error.message)
                                .push('\n');
                        });
                        info.dialog('option', 'title', 'Validation errors');
                        info.text(msg.value().join(''));
                        info.dialog('open');
                    },
                    // do not show validation errors
                    errorPlacement: function (error, element) {
                    }
                });

                // triggers the validation
                if (!form.valid()) {
                    return;
                }

                var data = {
                    id: $('#endpoint-id').val(),
                    desc: $('#desc').val(),
                    type: $('#endpoint-type').val(),
                    host: $('#host').val(),
                    port: $('#port').val(),
                    url: $('#url').val(),
                    resolutionStrategy: $('#resolution-strategy').val(),
                    //active: $('#endpoint-state').val(),
                    active: $('#endpoint-state').is(':checked'),
                    notify: $('#notification').is(':checked')
                };

                doAjaxPostTemplate('/endpoint/add', data, 'Add endpoint failed').then(refreshData);
                $(this).dialog('close');
            },
            'Cancel': function () {
                $(this).dialog('close');
            }
        },
        open: function (event, ui) {
            var strategies = [];
            $.get('/resolution-strategies', function (resolutionStrategies, status) {
                strategies = resolutionStrategies;
            }).fail(function (jqXHR, status, error) {
                $('#info-dialog').text(error);
            }).then(function () {
                $('#add-endpoint-dialog').html(addEndpointCompiled({
                    strategies: strategies
                }));
                fixFormFieldsVisibility('socket');
                $('#endpoint-type').selectmenu({
                    select: function (event, ui) {
                        fixFormFieldsVisibility(ui.item.value);
                    }
                });
                //$('#endpoint-state').selectmenu();
                $('#endpoint-state').button().click(function () {
                    var text = $(this).is(':checked') ? 'Active' : 'Inactive';
                    $(this).button('option', 'label', text);
                });
                $('#endpoint-state-label').attr('aria-pressed', 'false');
                $('#notification').button().click(function () {
                    var text = $(this).is(':checked') ? 'Notification enabled' : 'Notification disabled';
                    $(this).button('option', 'label', text);
                });
                $('#notification-label').attr('aria-pressed', 'false');
            });
        },
        close: function () {
            $('#add-endpoint-form').validate().resetForm();
        }
    }, dialogDefaults));

    // Fix add endpoint dialog visibility based on the connector type
    function fixFormFieldsVisibility(selected) {
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

    // Register listeners
    //--------------------------------------------------------------

    // Show add endpoint dialog when the button is clicked
    $('#add-endpoint').click(function () {
        $('#add-endpoint-dialog').dialog('open');
        return false;
    });

    // Register listeners endpoints table elements
    function registerListeners() {
        // Show endpoint info when the endpoint id is clicked
        $('tbody td:first-child').on('click', function (event) {
            var row = $(event.target).parent();
            var data = {
                id: row.find('td:nth-of-type(1)').text(),
                desc: row.find('td:nth-of-type(2)').text(),
                type: row.find('td:nth-of-type(3)').text(),
                host: row.find('td:nth-of-type(4)').text(),
                port: row.find('td:nth-of-type(5)').text(),
                url: row.find('td:nth-of-type(6)').text(),
                status: row.find('td:nth-of-type(9)').attr('title')
            };
            var info = $('#info-dialog');
            info.dialog('option', 'title', 'Endpoint info');
            info.html(showEndpointCompiled(data)).dialog('open');
            return false;
        });

        // Register the listeners on action column (endpoint (de)activation, (dis)enable notification, deletion)
        var actions = [{
            selector: '.action-activate-endpoint',
            url: '/endpoint/activation',
            params: {
                activate: 'true'
            },
            msgOnFail: 'Endpoint activation failed'
        }, {
            selector: '.action-deactivate-endpoint',
            url: '/endpoint/activation',
            params: {
                activate: 'false'
            },
            msgOnFail: 'Endpoint deactivation failed'

        }, {
            selector: '.action-deactivate-notification',
            url: '/endpoint/notification',
            params: {
                notify: 'false'
            },
            msgOnFail: 'Notification deactivation failed'

        }, {
            selector: '.action-activate-notification',
            url: '/endpoint/notification',
            params: {
                notify: 'true'
            },
            msgOnFail: 'Notification deactivation failed'
        }, {
            selector: '.action-delete',
            url: '/endpoint/remove',
            msgOnFail: 'Endpoint removal failed',
            callback: function (id, action) {
                var msg = 'Delete endpoint \'' + id + '\' ?';
                $("#delete-confirm-dialog").data('id', id)
                    .data('action', action).text(msg).dialog('open');
            }
        }];

        _.each(actions, function (action) {
            $(action.selector).on('click', function (event) {
                var id = $(event.target).closest('tr').find('td:first-child').text();
                var params = _.defaults({id: id}, action.params);
                var callback = action.callback;
                if (_.isFunction(callback)) {
                    callback(id, action);
                } else {
                    doAjaxPostTemplate(action.url, params,
                        action.msgOnFail).then(refreshData);
                }
            });
        });
    }

    // Refresh endpoints table
    //--------------------------------------------------------------
    // Add the proper class to indicate (in)active and erroneous endpoints
    function markEndpoints() {
        $('.action-activate-endpoint').closest("tr").addClass('inactive-endpoint');
        $('.status-down, .status-unreachable').closest("tr").addClass('erroneous-endpoint');
        $('.status-undetermined').closest("tr").addClass('undetermined-endpoint');
        $('.status-up').closest("tr").addClass('healthy-endpoint');
    }

    function refreshData() {
        return $.get('/endpoints', function (endpoints, status) {
            $('#connection-lost-dialog').dialog('close');
            var total = endpoints.length, statusUp = 0, statusErr = 0, statusUndet = 0,
                upRatio = 100, errRatio = 0;
            _.each(endpoints, function (endpoint) {
                var timestamp = moment(endpoint.timestamp);
                var since = moment(endpoint.since);
                endpoint.timestamp = timestamp.format('MMMM Do YYYY, h:mm:ss');
                //endpoint.since = moment.utc(timestamp.diff(since)).format("HH:mm:ss");
                endpoint.since = moment.duration(timestamp.diff(since)).format('d[d],h[h]:m[m]:s[s]');
                var status = endpoint.status;
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

            $('#endpoints-table').html(endpointsCompiled({
                endpoints: endpoints,
                total: total,
                statusUp: statusUp,
                statusErr: statusErr,
                statusUndet: statusUndet,
                upRatio: upRatio,
                errRatio: errRatio
            }));
            registerListeners();
            markEndpoints();
        }).fail(function () {
            $('#connection-lost-dialog').dialog('open');
        });
    }

    refreshData();
    setInterval(refreshData, 30000);
});