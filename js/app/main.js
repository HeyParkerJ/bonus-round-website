define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:
    var content = require('../../content');
    var taphunter = require('./taphunter');
    var cms = require('./cms');
    var google = require('./google');
    var google_analytics = require ('./google-analytics');

    console.log("requireJS loaded")
});
