# Store your Form Data in Google Sheet with Email Notification Integration.

This repository provides a comprehensive guide and code implementation for seamlessly sending form data to a Google Sheet and triggering email notifications upon the entry of new data. It's a powerful solution that streamlines data collection and enhances communication by automating the notification process.

## Features

- **Google Sheet Integration:** Easily set up a Google Sheet to act as a centralized database for your form data.

- **Form Data Submission:** Learn different methods for submitting form data to Google Sheets, including examples for HTML forms, JavaScript and React.

- **Automated Email Notifications:** Implement email notification triggers to promptly alert specified recipients whenever new data is added to the Google Sheet.

- **Customization and Configuration:** Tailor the solution to your project's needs by customizing email content, recipients, and other parameters.

## Getting Started

1. [ **Google Sheet Setup:**](https://docs.google.com/spreadsheets/create)

   - Go to Google Sheet and Create a new Sheet that serve as your data repository. This is where we'll store the form data.
   - Set the following headers in the first row:
   - ![Header Example](/assets/headers_example.png)

2. **Create a Google App Script:**

   - Click on `Extensions -> Apps Script` This will open new Google Script. Rename it to your desired name. Ex: Form_Script".
   - ![Extension Navigating](/assets/appScript_example.png)]

   - here `Replace the myFunction() { ... section with the following code snippet`:
   -       // Original code from https://github.com/jamiewilson/form-to-google-sheets  
            const sheetName = 'Sheet1'
            const scriptProp = PropertiesService.getScriptProperties()
            function initialSetup() {
            const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
            scriptProp.setProperty('key', activeSpreadsheet.getId())
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
            const recipientEmail = 'abc@gmail.com, xyz@gamil.com';
            const subject = 'New alert!';
            const body = 'New entry in the sheet, Check it out!';
            
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



4. **Email Notification Setup:**

   - Configure email notification triggers to notify relevant admin upon new data entry.
    ![Header Example](/assets/notificationTrigger_example.png)
   - Customize email content and recipients according to your preferences.

5. **Security Considerations:**
   - Follow best practices to secure your form data and email notifications.

## Examples

Explore practical examples in various programming languages within the `examples/` directory. Each example is accompanied by detailed documentation to guide you through the implementation process.

## Contributing

Contributions are welcome! If you have improvements or additional features to suggest, feel free to submit a pull request. For major changes, please open an issue first to discuss potential updates.

## License

This project is licensed under the [MIT License](LICENSE), granting you the freedom to modify and distribute the code for your purposes.

## Acknowledgments

Special thanks to the open-source community and contributors who help improve and enhance this repository.

Happy coding!
