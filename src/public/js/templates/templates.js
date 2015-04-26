this["JST"] = this["JST"] || {};

this["JST"]["src/views/add-endpoint.hbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
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
    + "            </select>\n        </div>\n\n        <div class=\"form-entry\">\n            <input id=\"endpoint-state\" type=\"checkbox\"/>\n            <label id=\"endpoint-state-label\" for=\"endpoint-state\">Inactive</label>\n        </div>\n        <div class=\"form-entry\">\n            <input id=\"notification\" type=\"checkbox\"/>\n            <label id=\"notification-label\" for=\"notification\">Notification disabled</label>\n        </div>\n    </form>\n\n<!--</script> -->";
},"useData":true});

this["JST"]["src/views/endpoints-table.hbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <tr>\n                <td title=\"Show info\">"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "</td>\n                <td>"
    + alias3(((helper = (helper = helpers.desc || (depth0 != null ? depth0.desc : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"desc","hash":{},"data":data}) : helper)))
    + "</td>\n                <td>"
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "</td>\n                <td>"
    + alias3(((helper = (helper = helpers.host || (depth0 != null ? depth0.host : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"host","hash":{},"data":data}) : helper)))
    + "</td>\n                <td>"
    + alias3(((helper = (helper = helpers.port || (depth0 != null ? depth0.port : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"port","hash":{},"data":data}) : helper)))
    + "</td>\n                <td>"
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "</td>\n                <td>"
    + alias3(((helper = (helper = helpers.timestamp || (depth0 != null ? depth0.timestamp : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"timestamp","hash":{},"data":data}) : helper)))
    + "</td>\n                <td>"
    + alias3(((helper = (helper = helpers.since || (depth0 != null ? depth0.since : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"since","hash":{},"data":data}) : helper)))
    + "</td>\n\n"
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.status : depth0),"up",{"name":"ifEquals","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.status : depth0),"down",{"name":"ifEquals","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.status : depth0),"undetermined",{"name":"ifEquals","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.status : depth0),"unreachable",{"name":"ifEquals","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n                <td>\n"
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.active : depth0),true,{"name":"ifEquals","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.active : depth0),false,{"name":"ifEquals","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.notify : depth0),true,{"name":"ifEquals","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifEquals || (depth0 && depth0.ifEquals) || alias1).call(depth0,(depth0 != null ? depth0.notify : depth0),false,{"name":"ifEquals","hash":{},"fn":this.program(16, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                    <div title=\"Delete endpoint\">\n                        <img class=\"action-delete\">\n                    </div>\n                </td>\n            </tr>\n";
},"2":function(depth0,helpers,partials,data) {
    return "                    <td title=\"Up\"><img class=\"status-up\"></td>\n";
},"4":function(depth0,helpers,partials,data) {
    return "                    <td title=\"Down\"><img class=\"status-down\"></td>\n";
},"6":function(depth0,helpers,partials,data) {
    return "                    <td title=\"Undetermined\"><img class=\"status-undetermined\"></td>\n";
},"8":function(depth0,helpers,partials,data) {
    return "                    <td title=\"Unreachable\"><img class=\"status-unreachable\"></td>\n";
},"10":function(depth0,helpers,partials,data) {
    return "                        <div title=\"Deactivate endpoint\" style=\"display: inline-block;\">\n                            <img class=\"action-deactivate-endpoint\">\n                        </div>\n";
},"12":function(depth0,helpers,partials,data) {
    return "                        <div title=\"Activate endpoint\">\n                            <img class=\"action-activate-endpoint\">\n                        </div>\n";
},"14":function(depth0,helpers,partials,data) {
    return "                    <div title=\"Disable notification\">\n                        <img class=\"action-deactivate-notification\">\n                    </div>\n";
},"16":function(depth0,helpers,partials,data) {
    return "                    <div title=\"Enable notification\">\n                        <img class=\"action-activate-notification\">\n                    </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<!--<script id=\"endpoints-table\" type=\"text/x-handlebars-template\">-->\n\n    <table class=\"table table-hover\">\n        <thead>\n            <tr class=\"table-head\">\n                <th>Id</th>\n                <th>Description</th>\n                <th>Timestamp</th>\n                <th>Duration</th>\n                <th>Status</th>\n                <th>Actions</th>\n            </tr>\n        </thead>\n        <tbody id=\"endpoints-table-content\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.endpoints : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tbody>\n        <tfoot>\n            <tr>\n                <td colspan=\"6\">\n                    <div>Total endpoints: "
    + alias3(((helper = (helper = helpers.total || (depth0 != null ? depth0.total : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"total","hash":{},"data":data}) : helper)))
    + "</div>\n                    <div class=\"up-stats\">up: "
    + alias3(((helper = (helper = helpers.statusUp || (depth0 != null ? depth0.statusUp : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"statusUp","hash":{},"data":data}) : helper)))
    + "</div>\n                    <div class=\"erroneous-stats\">erroneous: "
    + alias3(((helper = (helper = helpers.statusErr || (depth0 != null ? depth0.statusErr : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"statusErr","hash":{},"data":data}) : helper)))
    + "</div>\n                    <div class=\"undetermined-stats\">undetermined: "
    + alias3(((helper = (helper = helpers.statusUndet || (depth0 != null ? depth0.statusUndet : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"statusUndet","hash":{},"data":data}) : helper)))
    + "</div>\n                    <div class=\"up-stats\">Up ratio: "
    + alias3(((helper = (helper = helpers.upRatio || (depth0 != null ? depth0.upRatio : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"upRatio","hash":{},"data":data}) : helper)))
    + "%</div>\n                    <div class=\"erroneous-stats\">Erroneous ratio: "
    + alias3(((helper = (helper = helpers.errRatio || (depth0 != null ? depth0.errRatio : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"errRatio","hash":{},"data":data}) : helper)))
    + "%</div>\n                </td>\n            </tr>\n        </tfoot>\n    </table>\n\n<!--</script>-->";
},"useData":true});

this["JST"]["src/views/show-endpoint.hbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
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