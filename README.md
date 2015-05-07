# cordova-plugin-config-file-xsl

Use XSLT in plugin.xml to transform common or platform-specific XML files. In particular, will permit you to go beyond what the built-in cordova config-file can do, such as editing and removing nodes, and working with attributes.

You'll need to make sure both npm packages `node_xslt` and `elementtree` are available to this plugin.

Example usage:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<plugin
	xmlns="http://apache.org/cordova/ns/plugins/1.0"
	xmlns:android="http://schemas.android.com/apk/res/android"
	id="cordova-plugin-example"
	version="0.0.1">

	<platform name="android">
		<dependency id="cordova-plugin-config-file-xsl" url="https://github.com/matb33/cordova-plugin-config-file-xsl" />
		<config-file-xsl target="AndroidManifest.xml">
			<xsl:stylesheet version="1.0"
				xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
				xmlns:android="http://schemas.android.com/apk/res/android"
				xmlns:tools="http://schemas.android.com/tools">

				<xsl:strip-space elements="*" />
				<xsl:output method="xml" indent="yes" />

				<xsl:template match="@*|node()">
					<xsl:copy>
						<xsl:apply-templates select="@*|node()" />
					</xsl:copy>
				</xsl:template>

				<!-- don't preserve, always overwrite these -->
				<xsl:template match="intent-filter" />
				<xsl:template match="activity-alias" />
				<xsl:template match="uses-sdk" />
				<xsl:template match="meta-data" />
				<xsl:template match="uses-feature[@android:name='android.hardware.touchscreen']" />
				<xsl:template match="uses-feature[@android:name='android.hardware.wifi']" />
				<xsl:template match="uses-feature[@android:name='android.hardware.location']" />
				<xsl:template match="uses-feature[@android:name='android.hardware.location.network']" />
				<xsl:template match="uses-feature[@android:name='android.hardware.type.television']" />
				<xsl:template match="uses-feature[@android:name='android.software.leanback']" />

				<xsl:template match="activity[@android:name='CordovaApp']">
					<!-- Default activity, but also what Fire TV launches -->
					<xsl:copy>
						<xsl:attribute name="android:configChanges">orientation|keyboardHidden|keyboard|screenSize|locale</xsl:attribute>
						<xsl:attribute name="android:label">@string/activity_name</xsl:attribute>
						<xsl:attribute name="android:launchMode">singleTop</xsl:attribute>
						<xsl:attribute name="android:theme">@android:style/Theme.Black.NoTitleBar</xsl:attribute>
						<xsl:attribute name="android:windowSoftInputMode">adjustPan</xsl:attribute>

						<xsl:apply-templates select="@*" />

						<intent-filter android:label="@string/launcher_name">
							<action android:name="android.intent.action.MAIN" />
							<category android:name="android.intent.category.DEFAULT" />
							<category android:name="android.intent.category.LAUNCHER" />
						</intent-filter>
						<meta-data android:name="settings" android:value="minimalanims=1&amp;chromecastjs=0" />

						<xsl:apply-templates select="node()" />
					</xsl:copy>

					<!-- Leanback activity, only respected by Google Play -->
					<activity-alias>
						<xsl:attribute name="android:label">@string/activity_name</xsl:attribute>
						<xsl:attribute name="android:name">LeanbackApp</xsl:attribute>
						<xsl:attribute name="android:targetActivity">CordovaApp</xsl:attribute>

			            <intent-filter android:label="@string/launcher_name">
							<action android:name="android.intent.action.MAIN" />
							<category android:name="android.intent.category.LEANBACK_LAUNCHER" />
							<category android:name="tv.ouya.intent.category.APP" />
						</intent-filter>

						<meta-data android:name="settings" android:value="minimalanims=1&amp;chromecastjs=0&amp;forcebigpicture=1" />
					</activity-alias>
				</xsl:template>

				<xsl:template match="manifest">
					<xsl:copy>
						<xsl:attribute name="android:hardwareAccelerated">true</xsl:attribute>

						<xsl:apply-templates select="@*|node()" />

						<uses-sdk android:minSdkVersion="16" android:targetSdkVersion="22" />

						<uses-feature android:name="android.hardware.touchscreen" android:required="false" />
						<uses-feature android:name="android.hardware.wifi" android:required="false" />
						<uses-feature android:name="android.hardware.location" android:required="false" />
						<uses-feature android:name="android.hardware.location.network" android:required="false" />
						<uses-feature android:name="android.hardware.type.television" android:required="false" />
						<uses-feature android:name="android.software.leanback" android:required="false" />

					</xsl:copy>
				</xsl:template>

				<xsl:template match="application">
					<xsl:copy>
						<xsl:attribute name="android:hardwareAccelerated">true</xsl:attribute>
						<xsl:attribute name="android:banner">@drawable/banner</xsl:attribute>
						<xsl:attribute name="android:hardwareAccelerated">true</xsl:attribute>
						<xsl:attribute name="android:icon">@drawable/icon</xsl:attribute>
						<xsl:attribute name="android:label">@string/app_name</xsl:attribute>
						<xsl:attribute name="android:largeHeap">true</xsl:attribute>

						<xsl:apply-templates select="@*|node()" />
					</xsl:copy>
				</xsl:template>

			</xsl:stylesheet>
		</config-file-xsl>
	</platform>
</plugin>
```