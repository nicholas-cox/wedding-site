# RSVP Implementation Plan

## Overview
Collect RSVPs via a custom form on the website. Guest lookup happens instantly in the frontend (no API call), and submissions are saved to a Google Sheet via Apps Script.

---

## Architecture

```
Guest types name
       ↓
Frontend JS searches local guestList array (instant)
       ↓
Form displays party members + meal options
       ↓
Submit → POST to Google Apps Script
       ↓
Apps Script writes to "Responses" tab in Google Sheet
```

---

## Data Structures

### Frontend: `guestList` array in script.js

```javascript
const guestList = [
  { household: 1, name: "John Smith", plusOne: false },
  { household: 1, name: "Jane Smith", plusOne: false },
  { household: 2, name: "Bob Johnson", plusOne: true },
  // ... ~83 entries total
];
```

### Google Sheet: `Responses` tab

| Timestamp | Household | Name | Attending | Meal | Dietary | Plus One Name | Plus One Meal | Plus One Dietary |
|-----------|-----------|------|-----------|------|---------|---------------|---------------|------------------|

Leave this tab empty - the Apps Script will populate it.

### Your reference spreadsheet: `GuestList` tab

| Household | Name | Plus One |
|-----------|------|----------|
| 1 | John Smith | No |
| 1 | Jane Smith | No |
| 2 | Bob Johnson | Yes |

Use this to manage your list and generate the JS array.

---

## Meal Options

- Salmon
- Crab Cakes
- Pasta Pomodoro (vegan)

---

## Implementation Steps

### Step 1: Prepare Guest Data

1. Format your guest list in Google Sheets with columns: `Household | Name | Plus One`
2. Assign household numbers (couples/families share a number, solo guests get unique numbers)
3. Mark Plus One as "Yes" or "No" for each guest

### Step 2: Create the Responses Sheet

1. In your existing wedding Google Sheet, create a new tab called `Responses`
2. Add header row: `Timestamp | Household | Name | Attending | Meal | Dietary | Plus One Name | Plus One Meal | Plus One Dietary`

### Step 3: Set Up Google Apps Script

1. In Google Sheets, go to Extensions → Apps Script
2. Replace the default code with the script (to be provided)
3. Deploy as web app:
   - Click Deploy → New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
4. Copy the deployment URL

### Step 4: Generate the JavaScript Guest Array

Use this formula in a helper column to generate JS objects from your spreadsheet:
```
="  { household: "&A2&", name: """&B2&""", plusOne: "&IF(C2="Yes","true","false")&" },"
```

Copy the output into script.js as the `guestList` array.

### Step 5: Add Frontend Code

1. Update `index.html`: Replace RSVP "Coming Soon" placeholder with the form HTML
2. Update `script.js`: Add the guestList array, lookup function, and form submission handler
3. Update `styles.css`: Style the RSVP form to match site aesthetic

### Step 6: Test

1. Test name lookup with various guests
2. Test household grouping (both members of a couple should see each other)
3. Test +1 field visibility (only shows when allowed)
4. Test form submission → verify data appears in Responses sheet
5. Test error states (name not found, required fields missing)

### Step 7: Deploy

1. Commit and push to GitHub
2. Verify on live site

---

## Form UX Flow

1. **Initial state**: Single input field "Enter your name as it appears on the invitation"
2. **After lookup - found**:
   - Show greeting: "Welcome, [Name]!"
   - If household has multiple people, show attendance + meal fields for each
   - If plusOne allowed, show optional "+1" section
3. **After lookup - not found**:
   - Show message: "We couldn't find that name. Please try again or contact us."
4. **After submit**:
   - Show confirmation: "Thank you! Your RSVP has been recorded."

---

## Code to be Written

- [ ] Google Apps Script for handling form submissions
- [ ] HTML form markup for RSVP section
- [ ] JavaScript: guestList array (generated from spreadsheet)
- [ ] JavaScript: name lookup function
- [ ] JavaScript: form display/hide logic based on lookup
- [ ] JavaScript: form submission handler (fetch POST to Apps Script)
- [ ] CSS: Form styling

---

## Notes

- ~83 guests across ~50 households
- Guest data stored in frontend (small enough, instant lookups)
- Only the submit goes to Google Apps Script (no lookup API calls)
- Name matching should be case-insensitive
- Consider fuzzy matching or showing suggestions if exact match fails
