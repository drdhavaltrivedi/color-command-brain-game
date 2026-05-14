const fs = require('fs');
const path = require('path');

const appJsonPath = path.join(__dirname, 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

// Increment Android versionCode
if (appJson.expo.android && appJson.expo.android.versionCode) {
  appJson.expo.android.versionCode += 1;
} else if (appJson.expo.android) {
  appJson.expo.android.versionCode = 1;
}

// Increment iOS buildNumber
if (appJson.expo.ios && appJson.expo.ios.buildNumber) {
  const current = parseInt(appJson.expo.ios.buildNumber, 10);
  appJson.expo.ios.buildNumber = (current + 1).toString();
} else if (appJson.expo.ios) {
  appJson.expo.ios.buildNumber = "1";
}

// Increment semantic version (patch)
if (appJson.expo.version) {
  const parts = appJson.expo.version.split('.');
  if (parts.length === 3) {
    parts[2] = (parseInt(parts[2], 10) + 1).toString();
    appJson.expo.version = parts.join('.');
  }
}

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
console.log(`Version bumped to: ${appJson.expo.version}`);
console.log(`Android versionCode: ${appJson.expo.android?.versionCode}`);
console.log(`iOS buildNumber: ${appJson.expo.ios?.buildNumber}`);
