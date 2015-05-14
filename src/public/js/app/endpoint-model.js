/**
 * Created by jpsoroulas.
 */
define(['backbone', 'jquery', 'moment', 'moment-duration-format'], function (Backbone, $, moment) {

    return Backbone.Model.extend({
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
                        model.trigger('op:failed', model, jqXHR.responseJSON);
                    }
                };
                settings.type = enable ? 'POST' : 'DELETE';
                return $.ajax(_.extend(settings, _settings));
            }
        }
    );

});
