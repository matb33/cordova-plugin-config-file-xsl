module.exports = function (context) {
	var xslt = require("node_xslt");
	var et = require("elementtree");
	var fs = require("fs");
	var path = require("path");

	function processConfigFileXsl(platform, xslConfigElement) {
		var target = xslConfigElement.attrib && xslConfigElement.attrib.target;
		if (!target) return;

		var xslStylesheetElement = xslConfigElement._children[0];
		if (!xslStylesheetElement) return;

		var xslString = et.tostring(xslStylesheetElement);
		var xmlFilename = path.join(context.opts.projectRoot, "platforms", platform, target);

		var xsl = xslt.readXsltString(xslString);
		var xml = xslt.readXmlFile(xmlFilename);

		try {
			var result = xslt.transform(xsl, xml, []);
			if (result) fs.writeFileSync(xmlFilename, result, "utf-8");
		} catch (e) {
			return console.error(e);
		}
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