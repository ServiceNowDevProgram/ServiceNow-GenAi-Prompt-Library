# Phase 1 Deployment Guide: Database Schema & Infrastructure

## Overview
Phase 1 adds the database foundation for search, filtering, and tagging features:
- AI Provider field (7 provider options)
- Many-to-many category table (multiple categories per prompt)
- Migration script for existing data

## Prerequisites
- ServiceNow instance access with admin privileges
- ServiceNow Studio access
- Access to the ServiceNow GenAI Prompt Library application scope

---

## Deployment Steps

### Step 1: Pull Latest Changes from GitHub

If you're using ServiceNow Source Control integration:
1. Navigate to **Studio** in your ServiceNow instance
2. Open the **ServiceNow GenAI Prompt Library** application
3. Click **Source Control** > **Pull from Repository**
4. This will import all the new XML files automatically

**OR** If manually importing:
1. Download the following files from the repository
2. Import them via **System Update Sets** or **Studio**

---

### Step 2: Verify Schema Creation

#### 2.1 Check AI Provider Field
1. Navigate to **System Definition > Tables**
2. Search for table: `x_snc_ehd_servic_0_prompt`
3. Open the table and go to **Columns** tab
4. Verify field `ai_provider` exists (String, max_length: 40)

#### 2.2 Check AI Provider Choices
1. Navigate to **System Definition > Choice Lists**
2. Search for table: `x_snc_ehd_servic_0_prompt`, element: `ai_provider`
3. Verify 7 choices exist:
   - ✅ claude → "Claude (Anthropic)"
   - ✅ github_copilot → "GitHub Copilot"
   - ✅ ms_copilot → "Microsoft Copilot"
   - ✅ chatgpt → "ChatGPT (OpenAI)"
   - ✅ gemini → "Gemini (Google)"
   - ✅ now_assist → "Now Assist (ServiceNow)"
   - ✅ other → "Other AI Provider"

#### 2.3 Check M2M Category Table
1. Navigate to **System Definition > Tables**
2. Search for: `x_snc_ehd_servic_0_prompt_category_m2m`
3. Verify table exists with fields:
   - `prompt` (Reference to x_snc_ehd_servic_0_prompt)
   - `category` (Reference to x_snc_ehd_servic_0_category)

---

### Step 3: Run Migration Script

This script migrates existing single-category relationships to the new many-to-many table.

#### 3.1 Check Migration Status (Before)
1. Navigate to **System Definition > Scripts - Background**
2. Run this script to check current state:

```javascript
// Check migration status BEFORE running migration
var migrator = new x_snc_ehd_servic_0.MigratePromptCategories();
var status = migrator.checkStatus();

gs.info('=== MIGRATION STATUS (BEFORE) ===');
gs.info('Total Active Prompts: ' + status.totalPrompts);
gs.info('Prompts with Category: ' + status.promptsWithCategory);
gs.info('M2M Records: ' + status.m2mRecords);
gs.info('Prompts Needing Migration: ' + status.promptsNotInM2M.length);

if (status.promptsNotInM2M.length > 0) {
    gs.info('Sample prompts needing migration: ' + status.promptsNotInM2M.slice(0, 10).join(', '));
}
```

**Expected Output:**
- Should show your total prompts and how many have categories
- M2M Records should be 0 (or very low if some already exist)
- You should see prompts that need migration

#### 3.2 Run Migration
Once you've verified the status, run the migration:

```javascript
// Run the migration
var migrator = new x_snc_ehd_servic_0.MigratePromptCategories();
var results = migrator.migrate();

gs.info('=== MIGRATION RESULTS ===');
gs.info('Total Prompts Processed: ' + results.totalPrompts);
gs.info('Successfully Migrated: ' + results.migratedPrompts);
gs.info('Prompts Without Category: ' + results.promptsWithoutCategory);
gs.info('Duplicates Skipped: ' + results.duplicatesSkipped);

if (results.errors.length > 0) {
    gs.error('Errors occurred: ' + results.errors.length);
    results.errors.forEach(function(err) {
        gs.error('  - ' + err);
    });
} else {
    gs.info('Migration completed successfully with no errors!');
}
```

**Expected Output:**
- Successfully Migrated should equal Prompts with Category
- Errors should be empty
- You'll see progress messages every 100 prompts

#### 3.3 Verify Migration (After)
Run the status check again to verify migration completed:

```javascript
// Verify migration completed successfully
var migrator = new x_snc_ehd_servic_0.MigratePromptCategories();
var status = migrator.checkStatus();

gs.info('=== MIGRATION STATUS (AFTER) ===');
gs.info('Total Active Prompts: ' + status.totalPrompts);
gs.info('Prompts with Category: ' + status.promptsWithCategory);
gs.info('M2M Records: ' + status.m2mRecords);
gs.info('Prompts Still Needing Migration: ' + status.promptsNotInM2M.length);

// Validation
if (status.m2mRecords === status.promptsWithCategory) {
    gs.info('✅ SUCCESS: All prompts with categories have been migrated!');
} else {
    gs.warn('⚠️ WARNING: M2M record count does not match prompts with categories');
    gs.warn('This could be normal if some prompts have multiple categories already');
}

if (status.promptsNotInM2M.length === 0) {
    gs.info('✅ SUCCESS: No prompts remaining to migrate!');
} else {
    gs.warn('⚠️ WARNING: ' + status.promptsNotInM2M.length + ' prompts still need migration');
    gs.warn('Sample: ' + status.promptsNotInM2M.slice(0, 10).join(', '));
}
```

---

### Step 4: Manual Verification

#### 4.1 Test AI Provider Field
1. Navigate to **ServiceNow GenAI Prompt Library > Prompts**
2. Open any prompt record
3. Scroll to find the **AI Provider** field
4. Verify the dropdown shows all 7 provider options
5. Select a provider and save
6. Verify it saves correctly

#### 4.2 Test M2M Category Table
1. Navigate to **System Definition > Tables & Columns**
2. Search for and open: `x_snc_ehd_servic_0_prompt_category_m2m`
3. Click **Show records in this table**
4. Verify you see records with prompt and category references
5. Pick a few random records and verify:
   - Prompt reference is valid
   - Category reference is valid
   - They match the original prompt's category

#### 4.3 Spot Check Prompts
1. Navigate to **ServiceNow GenAI Prompt Library > Prompts**
2. Open 3-5 random prompts
3. For each prompt:
   - Note the category in the `category` field
   - Navigate to the **Related Lists** at the bottom
   - Look for **Prompt Category M2M** related list
   - Verify the related list shows a matching category entry

---

### Step 5: Database Indexes (Optional but Recommended)

For better performance, add indexes on the new fields:

```javascript
// Note: This may require elevated permissions
// You may need to work with your ServiceNow admin to create these indexes

// Create index on ai_provider field
// Navigate to: System Definition > Tables
// Open x_snc_ehd_servic_0_prompt
// Go to Database Indexes tab
// Create new index on 'ai_provider' column

// Create index on m2m prompt field
// Navigate to: System Definition > Tables
// Open x_snc_ehd_servic_0_prompt_category_m2m
// Go to Database Indexes tab
// Create new index on 'prompt' column

// Create index on m2m category field
// Create another index on 'category' column
```

**OR** via background script (if you have permissions):

```javascript
// WARNING: Only run if you have database admin permissions
// This creates indexes for better query performance

var indexHelper = new GlideDBObjectManager();

// Index on prompt table - ai_provider field
gs.info('Creating index on x_snc_ehd_servic_0_prompt.ai_provider...');
// Note: Actual index creation requires admin privileges
// Consult your DBA or use ServiceNow UI method above

gs.info('Phase 1 database indexes should be created via ServiceNow UI');
gs.info('See deployment guide for instructions');
```

---

## Testing Checklist

After deployment, verify:

- [ ] **AI Provider field** appears on prompt records
- [ ] **All 7 provider choices** are available in the dropdown
- [ ] **M2M table** created successfully (x_snc_ehd_servic_0_prompt_category_m2m)
- [ ] **Migration script** executed without errors
- [ ] **M2M record count** matches prompts with categories
- [ ] **Spot check**: 3-5 random prompts have correct m2m entries
- [ ] **Can manually select** AI provider on a prompt and save
- [ ] **No errors** in system logs related to new schema
- [ ] **(Optional)** Database indexes created for performance

---

## Rollback Plan (If Needed)

If issues occur, you can rollback:

### Option 1: Remove via Update Set
1. Navigate to **System Update Sets > Retrieved Update Sets**
2. Find the update set containing Phase 1 changes
3. Select **Back out this update set**
4. This will remove the new fields and table

### Option 2: Manual Removal
1. **Delete m2m table:**
   - Navigate to **System Definition > Tables**
   - Find `x_snc_ehd_servic_0_prompt_category_m2m`
   - Delete the table (this also deletes all m2m records)

2. **Remove AI Provider field:**
   - Navigate to **System Definition > Tables**
   - Open `x_snc_ehd_servic_0_prompt`
   - Find `ai_provider` field in Columns tab
   - Delete the field

3. **Remove choices:**
   - Navigate to **System Definition > Choice Lists**
   - Search for `ai_provider` choices
   - Delete all 7 choice records

4. **Remove migration script:**
   - Navigate to **System Definition > Script Includes**
   - Find `MigratePromptCategories`
   - Delete the script include

**Note:** Rollback is safe because:
- No existing data is modified (category field remains unchanged)
- M2M table is new and doesn't affect existing functionality
- AI Provider field is optional (empty values are allowed)

---

## Troubleshooting

### Issue: Migration script not found
**Error:** `x_snc_ehd_servic_0.MigratePromptCategories is not defined`

**Solution:**
1. Verify the script include was imported
2. Navigate to **System Definition > Script Includes**
3. Search for: `MigratePromptCategories`
4. Verify it's in the correct scope: `x_snc_ehd_servic_0`

### Issue: M2M table not found
**Error:** `Table x_snc_ehd_servic_0_prompt_category_m2m is invalid`

**Solution:**
1. Check if table was created in correct scope
2. Navigate to **System Definition > Tables**
3. Search for: `x_snc_ehd_servic_0_prompt_category_m2m`
4. If missing, re-import the table XML file

### Issue: Duplicate m2m records
**Symptom:** Migration reports duplicates skipped

**Solution:**
- This is normal if you run migration multiple times
- The script checks for existing records and skips them
- No action needed

### Issue: Some prompts not migrated
**Symptom:** `promptsNotInM2M.length > 0` after migration

**Solution:**
1. Check if those prompts have null category (expected)
2. Verify prompts are active
3. Re-run migration script (safe to run multiple times)

---

## Next Steps

Once Phase 1 is deployed, tested, and verified:

1. **Communicate to users:** New AI Provider field is available (optional)
2. **Monitor for issues:** Check system logs for any errors
3. **Proceed to Phase 2:** Basic Search Functionality
   - Search box in library widget
   - Keyword search implementation
   - Clear filters functionality

---

## Support

If you encounter issues:
1. Check ServiceNow system logs: **System Logs > System Log > All**
2. Review error messages from migration script
3. Verify source control sync completed successfully
4. Check that all XML files were imported

---

## Summary

Phase 1 adds the database foundation with:
- ✅ AI Provider field with 7 provider choices
- ✅ Many-to-many category table for multiple categories
- ✅ Migration script to populate m2m table
- ✅ Backwards compatibility maintained
- ✅ No breaking changes to existing functionality

**Total Time:** ~15-30 minutes (including verification)
**Risk Level:** Low (no existing data modified, optional fields)
**Rollback:** Available and straightforward

Good luck with the deployment! 🚀
