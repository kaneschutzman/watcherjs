## v2.5.0

#### Bug Fixes
Bug fixes

#### Features/improvements
* Save endpoint status transitions at persistent storage to provide endpoint status history
* Expose queries for endpoint status history as REST service
* Web console history chart implementation for visual representation of endpoint status history


#### Design/implementation
* [MongoDB](http://www.mongodb.org/) to persist the endpoints status transitions.

----

## v2.0.0

#### Bug Fixes
Various bug fixes

#### Features/improvements
* Expose functionality as REST services.
* Persist changes at activation and notification state
* Server side performance enchantments (async processing)
* Client side performance enchantments (more fine-grained ajax requests)

#### Design/implementation
* [Backbone](http://backbonejs.org/) at watcher.js web console implementation.
* [RequireJS] (http://requirejs.org/) module loader.