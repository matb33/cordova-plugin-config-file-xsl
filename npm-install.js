module.exports = function (context) {
	var Q = context.requireCordovaModule("q");
	var d = new Q.defer();

	var npm = require("npm");
	var path = require("path");

	// Delay so that cordova-plugin-xslt has a chance to be created in plugins/ folder
	setTimeout(function () {
		npm.load(function (err) {
			if (err) {
				console.error("npm.load error: " + JSON.stringify(err));
				return d.reject();
			}

			npm.commands.install(path.join(context.opts.projectRoot, "plugins", context.opts.plugin.id), ["node_xslt", "elementtree"], function (err, data) {
				if (err) {
					console.error("npm.load error: " + JSON.stringify(err));
					return d.reject();
				}

				d.resolve();
			});
		});
	}, 1000);

	return d.promise;
};