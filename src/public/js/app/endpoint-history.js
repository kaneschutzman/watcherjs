/**
 * Created by jpsoroulas.
 */
define(['underscore', 'backbone', 'jquery', 'highcharts', 'handlebars', 'templates', 'helper', 'moment'], function (_, Backbone, $, Highcharts, Handlebars, JST, helper, moment) {

    var historyTemplate = JST['src/views/endpoint-history.hbs'];
    var dialogDefaults = helper.dialogDefaults;
    var hoursInMills = 3600000;
    var dayInMills = 86400000;

    var infoDialog = helper.infoDialog;

    return Backbone.View.extend({
        el: '#endpoint-history-dialog',
        template: historyTemplate,
        infoDialog: infoDialog(),
        events: {
            'click #history-control-ff': 'moveForward',
            'click #history-control-rw': 'moveBackwards',
            'change #history-time-step': 'timeRangeStepChange',
            'click #history-control-rt': 'resetTimeRange'
        },

        initialize: function () {
        },

        _resetTimeRange: function (step) {
            var now = moment.utc().valueOf();
            this._timeStep = step;
            this._minTime = now - step;
            this._maxTime = now;
        },

        render: function (model) {
            this._resetTimeRange(dayInMills);
            var _self = this;
            var endpointId = model.id;
            this.model = model;

            this.$el.dialog(_.defaults({
                width: 650,
                height: 530,
                autoOpen: true,
                title: 'History'
            }, dialogDefaults));

            this.$el.html(this.template({}));

            this._getHistory(function (err, data) {
                if (!err) {
                    _self._buildChart(endpointId, data);
                } else {
                    _self._operationFailedInfo(err);
                }
            });

            return this;
        },

        moveForward: function (event) {
            this._maxTime = this._maxTime + this._timeStep;
            this._minTime = this._minTime + this._timeStep;
            this._redrawChart();
        },

        moveBackwards: function (event) {
            this._maxTime = this._maxTime - this._timeStep;
            this._minTime = this._minTime - this._timeStep;
            this._redrawChart();
        },

        timeRangeStepChange: function (event) {
            var step = $(event.target).val();
            this._resetTimeRange(step * dayInMills);
            this._redrawChart();
        },

        resetTimeRange: function(event) {
            this._resetTimeRange(this._timeStep);
            this._redrawChart();
        },

        _displayTimeRange: function () {
            var min = moment(this._minTime).utc().format('MM/DD HH:mm');
            var max = moment(this._maxTime).utc().format('MM/DD HH:mm');
            this.$('#history-time').text(min + ' - ' + max);
        },

        _operationFailedInfo: function (err) {
            this.infoDialog.html('Operation for failed!</br>' + err.message);
            this.infoDialog.dialog('open');
        },

        _getHistory: function (callback, form, to) {
            var queryOptions = {
                from: this._minTime,
                to: this._maxTime
            };
            this.model.doHistory(queryOptions, function (err, model, data) {
                callback(err, data);
            });
        },

        _buildChart: function (endpointId, rawData) {
            this._displayTimeRange();
            var options = this._chartConfiguration({
                xAxis: {
                    min: this._minTime,
                    max: this._maxTime
                }
            });
            options.series = _.values(this._buildHistoryChartData(rawData));
            this.chart = chart = new Highcharts.Chart(options);
            this.chart.setTitle({text: 'Endpoint \'' + endpointId + '\''});
        },

        _redrawChart: function () {
            var _self = this;
            this._displayTimeRange();
            this._getHistory(function (err, rawData) {
                if (!err) {
                    var chart = _self.chart;
                    _.extend(chart.options.xAxis[0], {
                        min: _self._minTime,
                        max: _self._maxTime
                    });
                    var data = _self._buildHistoryChartData(rawData);
                    _.each(data, function (value, key) {
                        chart.get(key).setData(value.data, false, false, false);
                    });
                    chart.xAxis[0].update();
                    chart.redraw();
                } else {
                    _self._operationFailedInfo(err);
                }
            });
        },

        _buildHistoryChartData: function (rawData) {
            var yValues = {
                up: 8,
                down: 6,
                unreachable: 5,
                undetermined: 1
            };

            var seriesData = {
                up: {
                    id: 'up',
                    name: 'up',
                    //color: '#008B45',
                    color: 'green',
                    data: []
                },
                down: {
                    id: 'down',
                    name: 'down',
                    color: '#ffa69e',
                    data: []
                },
                unreachable: {
                    id: 'unreachable',
                    name: 'unreachable',
                    color: '#ff433f',
                    //color: 'red',
                    data: []
                },
                undetermined: {
                    id: 'undetermined',
                    name: 'undetermined',
                    color: '#b6ddef',
                    data: []
                }
            };

            _.each(rawData, function (rec) {
                var fStatus = rec.statusTransition.from;
                var tStatus = rec.statusTransition.to;
                var lastPoint = _.last(seriesData[fStatus].data);
                if (lastPoint) {
                    seriesData[fStatus].data.push({
                        x: rec.timestamp,
                        y: yValues[fStatus]
                    });
                    seriesData[fStatus].data.push({
                        x: rec.timestamp,
                        y: null
                    });
                }
                seriesData[tStatus].data.push({
                    x: rec.timestamp,
                    y: yValues[tStatus]
                });
            });

            //complete the graph between the first point of the series and the min of the time range
            var firstRec = _.first(rawData);
            if (firstRec) {
                var fStatus = firstRec.statusTransition.from;
                if (fStatus) {
                    seriesData[fStatus].data.unshift({
                        x: firstRec.timestamp,
                        y: null
                    });
                    seriesData[fStatus].data.unshift({
                        x: firstRec.timestamp,
                        y: yValues[fStatus]
                    });
                    seriesData[fStatus].data.unshift({
                        x: this._minTime,
                        y: yValues[fStatus]
                    });
                }
            }

            //complete the graph between the last point of the series and the max of the time range
            var lastRec = _.last(rawData);
            if (lastRec) {
                var tStatus = lastRec.statusTransition.to;
                seriesData[tStatus].data.push({
                    x: this._maxTime,
                    y: yValues[tStatus]
                });
            }

            return seriesData;
        },

        _chartConfiguration: function (options) {
            return {
                chart: {
                    type: 'area',
                    renderTo: 'history-chart-container',
                    zoomType: 'xy'
                },
                title: {
                    text: 'Endpoint history',
                    style: {
                        color: '#1796e6',
                        fontWeight: 'bold'
                    }
                },
                xAxis: [_.extend({
                    title: {
                        text: 'time'
                    },
                    //gridLineWidth: 0,
                    type: 'datetime',
                    tickInterval: hoursInMills,
                    minTickInterval: hoursInMills,
                    labels: {
                        formatter: function () {
                            var timestamp = moment(this.value).utc();
                            if (timestamp.hours() == 0) {
                                return '<span style="color: red; font-weight: bold;">' + timestamp.format('MM/DD') + '</span>';
                            } else {
                                return timestamp.format('HH:mm');
                            }
                        }
                    }
                }, options.xAxis)],
                yAxis: [{
                    title: {
                        text: 'Status'
                    },
                    gridLineWidth: 0,
                    labels: {
                        enabled: false
                    },
                    min: 0,
                    max: 10
                }],
                tooltip: {
                    formatter: function () {
                        return 'Time: <b>' + moment(this.x).utc().format('HH:mm') +
                            '</b>, status: <b>' + this.series.name + '</b>';
                        //return 'Time: <b>' + moment(this.x).utc().format('HH:mm') + '</b>';
                    }
                },
                plotOptions: {
                    column: {
                        pointRange: hoursInMills
                    },
                    series: {
                        animation: false,
                        pointStart: hoursInMills,
                        pointInterval: hoursInMills
                    },
                    area: {
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: true
                                }
                            }
                        }
                    }
                }
            };
        }

    });
});