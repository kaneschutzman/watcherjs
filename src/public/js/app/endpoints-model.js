/**
 * Created by jpsoroulas.
 */
define(['backbone', 'endpoint-model'], function (Backbone, EndpointModel) {

    return Backbone.Collection.extend({
        model: EndpointModel,
        url: '/endpoints'
    });

});
