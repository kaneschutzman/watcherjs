/**
 * Created by jpsoroulas.
 */
define(['underscore', 'jquery', 'helper', 'endpoints-model', 'endpoints-view', 'endpoint-form', 'jquery-ui-bootstrap', 'jquery-ui'],

    function (_, $, helper, EndpointsModel, EndpointsView, EndpointFormView) {

       $(document).tooltip();

        var errorDialog = helper.infoDialog();
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
                    errorDialog.dialog('close');
                    endpointsView.render();
                },
                error: function (endpoints, response) {
                    if (0 == response.status) {
                        errorDialog.text('Wait the connection to be restored, or refresh the page by pressing F5.');
                    } else {
                        errorDialog.text('Error while processing the request: ' + response.statusText);
                    }
                    errorDialog.dialog('open');
                }
            });
        }

        setInterval(refreshData, 30000);
    });