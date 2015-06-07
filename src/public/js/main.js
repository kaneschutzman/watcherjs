/**
 * Created by jpsoroulas.
 */
define(['socket.io', 'underscore', 'jquery', 'helper', 'endpoints-model', 'endpoints-view', 'endpoint-form', 'jquery-ui-bootstrap', 'jquery-ui'],

    function (io, _, $, helper, EndpointsModel, EndpointsView, EndpointFormView) {

        $(document).tooltip();

        var infoDialog = helper.infoDialog();
        var endpointsModel = new EndpointsModel();
        var endpointsView = new EndpointsView({
            collection: endpointsModel
        });

        $('#add-endpoint').click(function () {
            new EndpointFormView({
                endpointsModel: endpointsModel
            });
            return false;
        });

        endpointsModel.fetch({reset: true});

        function refreshData() {
            endpointsModel.fetch({
                //reset: true,
                success: function () {
                    infoDialog.dialog('close');
                    endpointsView.render();
                },
                error: function (endpoints, response) {
                    if (0 === response.status) {
                        infoDialog.text('Unknown problem with watcher.js');
                    } else {
                        infoDialog.text('Error while processing the request: ' + response.statusText);
                    }
                    infoDialog.dialog('open');
                }
            });
        }

        //setInterval(refreshData, 30000);

        var socket = io.connect(getRootUrl());
        socket.on('wjs-connected', function (data) {
            infoDialog.dialog('close');
            console.log(data.message);
        });

        socket.on('connect_error', function (error) {
            infoDialog.text('Connection error with watcher.js, wait to be restored.');
            infoDialog.dialog('open');
        });

        socket.on('wjs-endpoints-updated', function (data) {
            refreshData();
        });

        function getRootUrl() {
            return $(location).attr('protocol') + "//" + $(location).attr('host');
        }
    });