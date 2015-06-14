## v2.5.4

#### Features/improvements
* Documentation and examples updates.

----

## v2.5.3

#### Bug Fixes
Fix, on connection error a warning message should be appeared

#### Features/improvements
* API documentation typos fixes/additions.
* Example with real time event notification update.

----

## v2.5.2

#### Features/improvements
* API documentation typos fixes/additions.
* Example with real time event notification.
* Minor refactor.

----

## v2.5.1

#### Features/improvements
* Real time notification for important events (endpoints status updated).
* Web console history chart, add button to reset the time range.

#### Design/implementation
* [socket.io](http://socket.io/) for real time event notification.

----

## v2.5.0

#### Bug Fixes
Various bug fixes.

#### Features/improvements
* Save endpoint status transitions at persistent storage to provide endpoint status history.
* Expose queries for endpoint status history as REST service.
* Web console history chart implementation for visual representation of endpoint status history.

#### Design/implementation
* [MongoDB](http://www.mongodb.org/) to persist the endpoints status transitions.

----

## v2.0.0

#### Bug Fixes
Various bug fixes.

#### Features/improvements
* Expose functionality as REST services.
* Persist changes at activation and notification state.
* Server side performance enchantments (async processing).
* Client side performance enchantments (more fine-grained ajax requests).

#### Design/implementation
* [Backbone](http://backbonejs.org/) at watcher.js web console implementation.
* [RequireJS] (http://requirejs.org/) module loader.