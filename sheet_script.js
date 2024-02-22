// Original code from https://github.com/jamiewilson/form-to-google-sheets

const sheetName = 'Sheet1'
const scriptProp = PropertiesService.getScriptProperties()

function initialSetup() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())

  // testSendEmail()
  createTrigger()
  sendNotification()
}

function createTrigger() {
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
  const sheet = doc.getSheetByName(sheetName)

  ScriptApp.newTrigger('sendNotification')
    .forSpreadsheet(doc)
    .onChange()
    .create();
}

function sendNotification() {
  const recipientEmail = 'abc@gmail.com,xyz@gmail.com'; //add mail recipients here
  const subject = 'New admission alert!';
  const body = 'New entry in the school admission sheet, Check it out!';

  MailApp.sendEmail(recipientEmail, subject, body);
}


function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const sheet = doc.getSheetByName(sheetName);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    const newRow = headers.map(function (header) {
      return header === 'Date' ? new Date() : e.parameter[header];
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    sendNotification(); // Call sendNotification() after the form submission

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
