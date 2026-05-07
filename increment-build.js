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

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
console.log(`Build number incremented to: ${appJson.expo.android.versionCode}`);
