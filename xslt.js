module.exports = function (context) {
	var libxslt = context.requireCordovaModule("libxslt");
	var path = context.requireCordovaModule("path");
	var et = context.requireCordovaModule("elementtree");
	var fs = context.requireCordovaModule("fs");

	function processConfigFileXsl(platform, xslConfigElement) {
		var target = xslConfigElement.attrib && xslConfigElement.attrib.target;
		if (!target) return;

		var xslStylesheetElement = xslConfigElement._children[0];
		if (!xslStylesheetElement) return;

		var xslString = et.tostring(xslStylesheetElement);
		var xmlFilename = path.join(context.opts.projectRoot, "platforms", platform, target);

		libxslt.parse(xslString, function (err, stylesheet) {
			if (err) return console.error(err);
			var documentString = fs.readFileSync(xmlFilename).toString();
			stylesheet.apply(documentString, [], function (err, result) {
				if (err) return console.error(err);
				if (result) fs.writeFileSync(xmlFilename, result, "utf-8");
			});
		});
	}

	context.opts.cordova.plugins.forEach(function (plugin) {
		var pluginFilename = path.join(context.opts.projectRoot, "plugins", plugin, "plugin.xml");
		if (fs.existsSync(pluginFilename)) {
			var data = fs.readFileSync(pluginFilename).toString();
			var etree = et.parse(data);

			etree.findall("./plugin/config-file-xsl").forEach(function (xslConfigElement) {
				processConfigFileXsl("common", xslConfigElement);
			});

			etree.findall(".//platform").forEach(function (pTree) {
				pTree.findall("./config-file-xsl").forEach(function (xslConfigElement) {
					processConfigFileXsl(pTree.attrib.name, xslConfigElement);
				});
			});
		}
	});
};