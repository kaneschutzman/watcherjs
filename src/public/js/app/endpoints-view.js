/**
 * Created by jpsoroulas.
 */
define(['underscore', 'jquery', 'backbone', 'endpoint-view', 'endpoint-history', 'templates', 'jquery-ui'], function (_, $, Backbone, EndpointView, EndpointHistory, JST) {

    return Backbone.View.extend({
        el: '#endpoints-table',
        //tagName: 'div',
        template: JST['src/views/endpoints-table.hbs'],

        initialize: function () {
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'remove', this.render);
            this.listenTo(this.collection, 'add', this.render);
            this.endpointHistory = new EndpointHistory();
        },

        render: function () {
            var _self = this;
            this.$el.empty();
            var endpoints = this.collection.models;
            var html = this.template(this._computeStats(endpoints));
            this.$el.html(html);
            var subView = document.createDocumentFragment();
            _.each(endpoints, function (endpoint) {
                var endpointView = new EndpointView({model: endpoint, endpointHistory: _self.endpointHistory});
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

});