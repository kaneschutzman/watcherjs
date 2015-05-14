/**
 * Created by jpsoroulas.
 */
define(['jquery', 'underscore', 'handlebars', 'jquery-ui'], function($, _, Handlebars) {

    Handlebars.registerHelper('ifEquals', function (o1, o2, options) {
        if (o1 === o2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    var dialogDefaults = {
        autoOpen: false,
        show: {
            effect: 'clip'
        },
        hide: {
            effect: 'clip'
        }
    };

    var infoDialog = function () {
        var $dialog = $('#info-dialog').dialog(_.defaults({
            resizable: false,
            width: 'auto',
            buttons: {
                'OK': function () {
                    $(this).dialog('close');
                }
            }
        }, dialogDefaults));
        return _.extend($dialog, Backbone.Events);
    };

    var approveAction = function (message) {
        var _dialog = $('#confirm-dialog').dialog(dialogDefaults);
        return (function () {
            var def = $.Deferred();
            _dialog.dialog('option', 'buttons',
                {
                    'OK': function () {
                        def.resolve();
                        $(this).dialog('close');
                    },
                    'CANCEL': function () {
                        def.reject();
                        $(this).dialog('close');
                    }
                });
            if (message) {
                _dialog.html(message);
            }
            _dialog.dialog('open');
            return def.promise();
        })();
    };

    return {
        dialogDefaults: dialogDefaults,
        infoDialog: infoDialog,
        approveAction: approveAction
    };
});
