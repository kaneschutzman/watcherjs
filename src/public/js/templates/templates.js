define(['handlebars'], function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["src/views/endpoint-form.hbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "                    <option>"
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<!--<script id=\"add-endpoint\" type=\"text/x-handlebars-template\"> -->\n\n    <form id=\"add-endpoint-form\" method=\"post\">\n        <div class=\"form-entry\">\n            <label for=\"endpoint-id\">id: *</label>\n            <input id=\"endpoint-id\" value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" name=\"endpoint-id\" type=\"text\" required>\n        </div>\n        <div class=\"form-entry\">\n            <label for=\"desc\">desc:</label>\n            <input id=\"desc\" value=\""
    + alias3(((helper = (helper = helpers.desc || (depth0 != null ? depth0.desc : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"desc","hash":{},"data":data}) : helper)))
    + "\" name=\"desc\" type=\"text\">\n        </div>\n        <div class=\"form-entry\">\n            <label for=\"endpoint-type\">endpoint type: *</label>\n            <select id=\"endpoint-type\" name=\"endpoint-type\">\n                <option selected=\"selected\">socket</option>\n                <option>http</option>\n            </select>\n        </div>\n        <div class=\"form-entry socket-enabled\">\n            <label for=\"host\">host:</label>\n            <input id=\"host\" value=\""
    + alias3(((helper = (helper = helpers.host || (depth0 != null ? depth0.host : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"host","hash":{},"data":data}) : helper)))
    + "\" name=\"host\" type=\"text\">\n        </div>\n        <div class=\"form-entry socket-enabled\">\n            <label for=\"port\">port:</label>\n            <input id=\"port\" value=\""
    + alias3(((helper = (helper = helpers.port || (depth0 != null ? depth0.port : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"port","hash":{},"data":data}) : helper)))
    + "\" name=\"port\" type=\"text\">\n        </div>\n        <div class=\"form-entry http-enabled\">\n            <label for=\"url\">url:</label>\n            <input id=\"url\" value=\""
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "\" name=\"url\" type=\"text\">\n        </div>\n\n        <div class=\"form-entry\">\n            <label for=\"resolution-strategy\">Resolution strategy:</label>\n            <select id=\"resolution-strategy\" name=\"resolution-strategy\">\n                <option selected=\"selected\"></option>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.strategies : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </select>\n        </div>\n\n        <div class=\"form-entry\">\n            <input id=\"activation-state\" type=\"checkbox\"/>\n            <label id=\"activation-state-label\" for=\"activation-state\">Inactive</label>\n        </div>\n        <div class=\"form-entry\">\n            <input id=\"notification\" type=\"checkbox\"/>\n            <label id=\"notification-label\" for=\"notification\">Notification disabled</label>\n        </div>\n    </form>\n\n<!--</script> -->";
},"useData":true});

this["JST"]["src/views/endpoint-history.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"history-panel\">\n    <div id=\"history-controls\">\n        <div class=\"history-time-range\">Time range: <span id=\"history-time\"></span></div>\n        <div class=\"history-nav\">\n            <select id=\"history-time-step\">\n                <option value=\"1\" selected=\"selected\">1 day</option>\n                <option value=\"7\">1 week</option>\n                <option value=\"30\">1 month</option>\n            </select>\n            <button id=\"history-control-rw\">&lt;&lt;</button>\n            <button id=\"history-control-ff\">&gt;&gt;</button>\n        </div>\n    </div>\n    <div id=\"history-chart-container\">\n    </div>\n</div>";
},"useData":true});

this["JST"]["src/views/endpoint-info.hbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <tr>\n                <td>host</td>\n                <td>"
    + alias3(((helper = (helper = helpers.host || (depth0 != null ? depth0.host : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"host","hash":{},"data":data}) : helper)))
    + "</td>\n            </tr>\n            <tr>\n                <td>port</td>\n                <td>"
    + alias3(((helper = (helper = helpers.port || (depth0 != null ? depth0.port : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"port","hash":{},"data":data}) : helper)))
    + "</td>\n            </tr>\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "            <tr>\n                <td>url</td>\n                <td>"
    + this.escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "</td>\n            </tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<!--<script id=\"show-endpoint\" type=\"text/x-handlebars-template\">-->\n\n    <table id=\"show-endpoint-table\">\n        <tr>\n            <td>id</td>\n            <td>"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "</td>\n        </tr>\n        <tr>\n            <td>desc</td>\n            <td>"
    + alias3(((helper = (helper = helpers.desc || (depth0 != null ? depth0.desc : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"desc","hash":{},"data":data}) : helper)))
    + "</td>\n        </tr>\n"
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.type : depth0),"socket",{"name":"ifEquals","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.type : depth0),"http",{"name":"ifEquals","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <tr>\n            <td>status</td>\n            <td>"
    + alias3(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"status","hash":{},"data":data}) : helper)))
    + "</td>\n        </tr>\n    </table>\n\n<!--</script>-->";
},"useData":true});

this["JST"]["src/views/endpoint.hbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "    <td title=\"Up\"><img class=\"status-up\"></td>\n";
},"3":function(depth0,helpers,partials,data) {
    return "    <td title=\"Down\"><img class=\"status-down\"></td>\n";
},"5":function(depth0,helpers,partials,data) {
    return "    <td title=\"Undetermined\"><img class=\"status-undetermined\"></td>\n";
},"7":function(depth0,helpers,partials,data) {
    return "    <td title=\"Unreachable\"><img class=\"status-unreachable\"></td>\n";
},"9":function(depth0,helpers,partials,data) {
    return "        <div title=\"Deactivate endpoint\">\n            <img class=\"action-deactivate-endpoint\">\n        </div>\n";
},"11":function(depth0,helpers,partials,data) {
    return "        <div title=\"Activate endpoint\">\n            <img class=\"action-activate-endpoint\">\n        </div>\n";
},"13":function(depth0,helpers,partials,data) {
    return "        <div title=\"Disable notification\">\n            <img class=\"action-disable-notification\">\n        </div>\n";
},"15":function(depth0,helpers,partials,data) {
    return "        <div title=\"Enable notification\">\n            <img class=\"action-enable-notification\">\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<td title=\"Show info\">"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "</td>\n<td>"
    + alias3(((helper = (helper = helpers.desc || (depth0 != null ? depth0.desc : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"desc","hash":{},"data":data}) : helper)))
    + "</td>\n<td>"
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "</td>\n<td>"
    + alias3(((helper = (helper = helpers.host || (depth0 != null ? depth0.host : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"host","hash":{},"data":data}) : helper)))
    + "</td>\n<td>"
    + alias3(((helper = (helper = helpers.port || (depth0 != null ? depth0.port : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"port","hash":{},"data":data}) : helper)))
    + "</td>\n<td>"
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "</td>\n<td>"
    + alias3(((helper = (helper = helpers.timestamp || (depth0 != null ? depth0.timestamp : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"timestamp","hash":{},"data":data}) : helper)))
    + "</td>\n<td>"
    + alias3(((helper = (helper = helpers.since || (depth0 != null ? depth0.since : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"since","hash":{},"data":data}) : helper)))
    + "</td>\n\n"
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.status : depth0),"up",{"name":"ifEquals","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.status : depth0),"down",{"name":"ifEquals","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.status : depth0),"undetermined",{"name":"ifEquals","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.status : depth0),"unreachable",{"name":"ifEquals","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n<td>\n"
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.active : depth0),true,{"name":"ifEquals","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.active : depth0),false,{"name":"ifEquals","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.notify : depth0),true,{"name":"ifEquals","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.notify : depth0),false,{"name":"ifEquals","hash":{},"fn":this.program(15, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    <div title=\"Delete endpoint\">\n        <img class=\"action-delete\">\n    </div>\n    <div title=\"History\">\n        <img class=\"action-history\">\n    </div>\n</td>";
},"useData":true});

this["JST"]["src/views/endpoints.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<table class=\"table table-hover\">\n    <thead>\n        <tr class=\"table-head\">\n            <th>Id</th>\n            <th>Description</th>\n            <th>Timestamp</th>\n            <th>Duration</th>\n            <th>Status</th>\n            <th>Actions</th>\n        </tr>\n    </thead>\n    <tbody id=\"endpoints-table-content\">\n    </tbody>\n    <tfoot>\n        <tr>\n            <td colspan=\"6\">\n                <div>Total endpoints: "
    + alias3(((helper = (helper = helpers.total || (depth0 != null ? depth0.total : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"total","hash":{},"data":data}) : helper)))
    + "</div>\n                <div class=\"up-stats\">up: "
    + alias3(((helper = (helper = helpers.statusUp || (depth0 != null ? depth0.statusUp : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"statusUp","hash":{},"data":data}) : helper)))
    + "</div>\n                <div class=\"erroneous-stats\">erroneous: "
    + alias3(((helper = (helper = helpers.statusErr || (depth0 != null ? depth0.statusErr : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"statusErr","hash":{},"data":data}) : helper)))
    + "</div>\n                <div class=\"undetermined-stats\">undetermined: "
    + alias3(((helper = (helper = helpers.statusUndet || (depth0 != null ? depth0.statusUndet : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"statusUndet","hash":{},"data":data}) : helper)))
    + "</div>\n                <div class=\"up-stats\">Up ratio: "
    + alias3(((helper = (helper = helpers.upRatio || (depth0 != null ? depth0.upRatio : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"upRatio","hash":{},"data":data}) : helper)))
    + "%</div>\n                <div class=\"erroneous-stats\">Erroneous ratio: "
    + alias3(((helper = (helper = helpers.errRatio || (depth0 != null ? depth0.errRatio : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"errRatio","hash":{},"data":data}) : helper)))
    + "%</div>\n            </td>\n        </tr>\n    </tfoot>\n</table>";
},"useData":true});

return this["JST"];

});