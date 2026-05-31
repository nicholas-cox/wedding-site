/**
 * Google Apps Script for Wedding RSVP Backend
 *
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet with the guest list
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Update the SHEET_ID below (from your Sheet URL)
 * 5. Click Deploy > New deployment
 * 6. Select type: Web app
 * 7. Set "Execute as": Me
 * 8. Set "Who has access": Anyone
 * 9. Click Deploy and authorize when prompted
 * 10. Copy the Web app URL and add it to script.js (GOOGLE_SCRIPT_URL)
 *
 * RSVP responses will be written to a tab named "RSVP" (created automatically if needed)
 */

// ============ CONFIGURATION ============
// Get this from your Google Sheet URL: https://docs.google.com/spreadsheets/d/SHEET_ID/edit
var SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';

// Tab name for RSVP responses
var RSVP_TAB_NAME = 'RSVP';

// Email settings
var EMAIL_FROM_NAME = 'Sarah & Nick Wedding';
var COUPLE_EMAIL = 'nicholasericcox@gmail.com'; // You'll receive a copy of each RSVP
var COUPLE_CC = 'sarah@sarahkobos.com'; // CC on RSVP notifications
// ========================================

/**
 * Handle POST requests from the wedding website
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Write to spreadsheet
    writeToSheet(data);

    // Send confirmation email
    sendConfirmationEmail(data);

    // Send notification to couple
    sendNotificationEmail(data);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error processing RSVP:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput('Wedding RSVP endpoint is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Write RSVP data to Google Sheet
 */
function writeToSheet(data) {
  var spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  var sheet = spreadsheet.getSheetByName(RSVP_TAB_NAME);

  // Create the RSVP tab if it doesn't exist
  if (!sheet) {
    sheet = spreadsheet.insertSheet(RSVP_TAB_NAME);
  }

  var timestamp = new Date().toISOString();

  // Add header row if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Household ID',
      'Guest Name',
      'Attending',
      'Vegan',
      'Is Plus One',
      'Plus One Of',
      'Submitter Email'
    ]);
  }

  // Add a row for each guest
  data.guests.forEach(function(guest) {
    sheet.appendRow([
      timestamp,
      data.householdId,
      guest.name,
      guest.attending ? 'Yes' : 'No',
      guest.vegan ? 'Yes' : 'No',
      'No',
      '',
      data.email
    ]);
  });

  // Add plus one if present
  if (data.plusOne && data.plusOne.name) {
    // Find the first attending guest to associate the +1 with
    var hostGuest = data.guests.find(function(g) { return g.attending; });
    var hostName = hostGuest ? hostGuest.name : data.guests[0].name;

    sheet.appendRow([
      timestamp,
      data.householdId,
      data.plusOne.name,
      'Yes',
      data.plusOne.vegan ? 'Yes' : 'No',
      'Yes',
      hostName,
      data.email
    ]);
  }
}

/**
 * Send confirmation email to the guest
 */
function sendConfirmationEmail(data) {
  var attending = data.guests.filter(function(g) { return g.attending; });
  var declining = data.guests.filter(function(g) { return !g.attending; });

  var subject = 'RSVP Confirmation - Sarah & Nick\'s Wedding';

  var body = 'Thank you for your RSVP!\n\n';
  body += 'We have received the following response:\n\n';

  if (attending.length > 0) {
    body += 'ATTENDING:\n';
    attending.forEach(function(guest) {
      var meal = guest.vegan ? ' (Vegan meal)' : '';
      body += '  - ' + guest.name + meal + '\n';
    });
    body += '\n';
  }

  if (data.plusOne && data.plusOne.name) {
    var plusOneMeal = data.plusOne.vegan ? ' (Vegan meal)' : '';
    body += '  - ' + data.plusOne.name + ' (+1)' + plusOneMeal + '\n\n';
  }

  if (declining.length > 0) {
    body += 'UNABLE TO ATTEND:\n';
    declining.forEach(function(guest) {
      body += '  - ' + guest.name + '\n';
    });
    body += '\n';
  }

  body += '---\n';
  body += 'September 19, 2026\n';
  body += 'Beech Tree Cottages, Madison, CT\n\n';
  body += 'If you need to make changes to your RSVP, please contact us at ' + COUPLE_EMAIL + '\n\n';
  body += 'With love,\n';
  body += 'Sarah & Nick';

  GmailApp.sendEmail(data.email, subject, body, {
    name: EMAIL_FROM_NAME
  });
}

/**
 * Send notification email to the couple
 */
function sendNotificationEmail(data) {
  var attending = data.guests.filter(function(g) { return g.attending; });
  var declining = data.guests.filter(function(g) { return !g.attending; });

  var subject = 'New RSVP: ' + data.email;

  var body = 'New RSVP received!\n\n';
  body += 'Household ID: ' + data.householdId + '\n';
  body += 'Email: ' + data.email + '\n\n';

  if (attending.length > 0) {
    body += 'ATTENDING (' + attending.length + '):\n';
    attending.forEach(function(guest) {
      var meal = guest.vegan ? ' [VEGAN]' : '';
      body += '  - ' + guest.name + meal + '\n';
    });
  }

  if (data.plusOne && data.plusOne.name) {
    var plusOneMeal = data.plusOne.vegan ? ' [VEGAN]' : '';
    body += '  - ' + data.plusOne.name + ' (+1)' + plusOneMeal + '\n';
  }

  if (declining.length > 0) {
    body += '\nDECLINING (' + declining.length + '):\n';
    declining.forEach(function(guest) {
      body += '  - ' + guest.name + '\n';
    });
  }

  GmailApp.sendEmail(COUPLE_EMAIL, subject, body, {
    name: 'Wedding RSVP System',
    cc: COUPLE_CC
  });
}

/**
 * Test function - run this to verify the script works
 */
function testScript() {
  var testData = {
    householdId: 'test-household',
    email: 'test@example.com',
    guests: [
      { name: 'Test Guest 1', attending: true, vegan: false },
      { name: 'Test Guest 2', attending: true, vegan: true }
    ],
    plusOne: {
      name: 'Test Plus One',
      vegan: false
    }
  };

  writeToSheet(testData);
  console.log('Test data written to sheet successfully!');
}
