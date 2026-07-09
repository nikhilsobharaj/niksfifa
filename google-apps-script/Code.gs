/**
 * Google Apps Script backend for reading/writing contest-data.json on Google Drive.
 *
 * Setup:
 * 1. Create a Google Sheet (optional) or just use Drive.
 * 2. Go to https://script.google.com → New project → paste this file.
 * 3. Set SCRIPT_PROPERTIES:
 *    - DATA_FILE_ID: Google Drive file ID of contest-data.json (upload site/data/contest-data.json to Drive)
 *    OR leave empty to auto-create fifa-contest-data.json in Drive root on first save.
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL into site/js/config.js → DATA_API_URL
 */

var DATA_FILE_NAME = 'fifa-contest-data.json';

function doGet(e) {
  return jsonResponse(readContestData());
}

function doPost(e) {
  try {
    var payload = e.postData && e.postData.contents ? e.postData.contents : '';
    if (!payload) {
      return jsonResponse({ success: false, error: 'Empty body' }, 400);
    }

    var parsed = JSON.parse(payload);
    writeContestData(JSON.stringify(parsed, null, 2));
    return jsonResponse({ success: true, updatedAt: parsed.updatedAt || new Date().toISOString() });
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) }, 500);
  }
}

function readContestData() {
  var file = getDataFile();
  if (!file) {
    return getDefaultData();
  }
  return JSON.parse(file.getBlob().getDataAsString());
}

function writeContestData(jsonText) {
  var file = getDataFile();
  if (file) {
    file.setContent(jsonText);
    return file;
  }
  return DriveApp.createFile(DATA_FILE_NAME, jsonText, MimeType.PLAIN_TEXT);
}

function getDataFile() {
  var props = PropertiesService.getScriptProperties();
  var fileId = props.getProperty('DATA_FILE_ID');

  if (fileId) {
    try {
      return DriveApp.getFileById(fileId);
    } catch (e) {
      // Fall through to search by name
    }
  }

  var files = DriveApp.getFilesByName(DATA_FILE_NAME);
  if (files.hasNext()) {
    return files.next();
  }
  return null;
}

function getDefaultData() {
  return {
    participants: [],
    fixtures: [],
    participantMeta: {},
    matches: [],
    betPerMatch: 20,
    updatedAt: new Date().toISOString()
  };
}

function jsonResponse(obj, statusCode) {
  var output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);

  // Apps Script does not support custom HTTP status codes directly in all contexts,
  // but the payload includes error info when needed.
  return output;
}
