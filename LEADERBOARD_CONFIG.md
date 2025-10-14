# Leaderboard Configuration Guide

This guide explains how to configure the leaderboard when adding new metrics or task groups.

## Overview

The leaderboard displays model performance across different task categories. Each category has:
- A main aggregate score (always visible by default)
- Optional subtask scores (can be toggled on/off by users)

## Current Structure

### Column Order
The table columns are ordered as follows:
1. **Model Info**: `model_name`, `publisher`
2. **Main Metrics**: `overall_latam_score`, `spanish_score`, `portuguese_score`, `translation_score`, `structured_extraction_score`
3. **Subtask Metrics**: Individual task scores grouped by category

### Main Metrics (Always Visible)
- `model_name` - Model identifier
- `publisher` - Model publisher (links to Hugging Face model page)
- `overall_latam_score` - Overall LATAM performance
- `spanish_score` - Spanish language tasks aggregate
- `portuguese_score` - Portuguese language tasks aggregate  
- `translation_score` - Translation tasks aggregate
- `structured_extraction_score` - Structured extraction tasks aggregate

### Task Groups
1. **Spanish LATAM** (`latam_es`) - Spanish language evaluation tasks
2. **Portuguese LATAM** (`latam_pr`) - Portuguese language evaluation tasks
3. **Translation** (`translation`) - Machine translation tasks
4. **Structured Extraction** (`structured_extraction`) - JSON extraction from unstructured text

## Adding New Metrics

### Step 1: Update Data Structure
Ensure your `leaderboard_table.json` includes the new metrics with the correct naming pattern:
- Main score: `{group_name}_score`
- Subtasks: `{group_name}_{subtask_name}`

### Step 2: Update Landing.tsx
1. **Add to DEFAULT_VISIBLE array** (line ~43):
   ```typescript
   const DEFAULT_VISIBLE = [
     'model_name',
     'publisher',
     'overall_latam_score',
     'spanish_score',
     'portuguese_score', 
     'translation_score',
     'structured_extraction_score',
     'your_new_score', // Add here
   ]
   ```

2. **Add to aggregates array** (line ~85):
   ```typescript
   const aggregatesArr = [
     'overall_latam_score', 
     'spanish_score', 
     'portuguese_score', 
     'translation_score', 
     'structured_extraction_score',
     'your_new_score', // Add here
   ]
   ```

3. **Add to groupPrefixMap** (line ~88):
   ```typescript
   const groupPrefixMap: Record<string, string> = { 
     latam_es: 'spanish_', 
     latam_pr: 'portuguese_', 
     translation: 'translation_', 
     structured_extraction: 'structured_extraction_',
     your_new_group: 'your_new_group_', // Add here
   }
   ```

### Step 3: Update Task Groups Configuration
Edit `public/tasks_groups.json` to add your new task group:

```json
{
  "task_groups": {
    "your_new_group": {
      "name": "Your New Group",
      "description": "Description of your new task group",
      "description_en": "English description",
      "description_es": "Spanish description", 
      "description_pt": "Portuguese description",
      "long_description": "Detailed description...",
      "long_description_en": "Detailed English description...",
      "long_description_es": "Detailed Spanish description...",
      "long_description_pt": "Detailed Portuguese description...",
      "repository": "https://github.com/your-repo",
      "subtasks": [
        "subtask1",
        "subtask2",
        "subtask3"
      ]
    }
  }
}
```

## File Locations

- **Main component**: `src/pages/Landing.tsx`
- **Task groups config**: `public/tasks_groups.json`
- **Leaderboard data**: `public/leaderboard_table.json`
- **Tasks list**: `public/tasks_list.json`

## Testing

After making changes:
1. Verify the new metrics appear in the main table
2. Check that subtasks are available in the filter panel
3. Test column toggling functionality
4. Ensure proper sorting works for new metrics

## Example: Adding Structured Extraction (Completed)

This was recently added as an example:

1. **Data**: Added `structured_extraction_score` and subtasks like `structured_extraction_extraction_quality_score`
2. **Landing.tsx**: Added to DEFAULT_VISIBLE, aggregates, and groupPrefixMap
3. **tasks_groups.json**: Added structured_extraction group with subtasks:
   - `extraction_quality_score`
   - `composite_score`
   - `schema_validity` 
   - `field_f1_partial`

The result is a new main metric that's always visible, with optional subtask details that users can toggle on/off in the filter panel.

### Example: Adding Structured Extraction (Completed)

This was recently added as an example:

1. **Data**: Added `structured_extraction_score` and subtasks like `structured_extraction_extraction_quality_score`
2. **Landing.tsx**: Added to DEFAULT_VISIBLE, aggregates, and groupPrefixMap
3. **tasks_groups.json**: Added structured_extraction group with subtasks:
   - `extraction_quality_score`
   - `composite_score`
   - `schema_validity` 
   - `field_f1_partial`
   - `hallucination_rate`

The result is a new main metric that's always visible, with optional subtask details that users can toggle on/off in the filter panel.

## Special Column Types

### Publisher Column
The `publisher` column is a special case that:
- Shows the publisher name (e.g., "01-ai")
- Links to the Hugging Face model page using the `full_model_name` field
- Is toggleable in the "Model Info" section of the filter panel
- Uses the format: `https://huggingface.co/{full_model_name}`

To add similar special columns, modify the cell rendering logic in `LeaderboardTable` component around line 129.

## Layout Configuration

### Page Width
The leaderboard uses a full-width layout to maximize space utilization:
- **Container**: Direct padding (`px-4 md:px-6 lg:px-8`) instead of container class
- **Sidebar**: Fixed width `w-80` with `flex-shrink-0` to prevent compression
- **Main content**: `flex-1 min-w-0` to take remaining space and allow proper overflow
- **Table minimum width**: `min-w-[800px]` on mobile, `min-w-[900px]` on desktop
- **Table wrapper**: Removed card padding, uses direct border styling

### Column Ordering
Columns are ordered in the `ordered` array in `Landing.tsx`:
```typescript
const ordered = ['model_name', 'publisher', ...aggregatesArr]
```

This ensures the order: Model Info → Main Metrics → Subtask Metrics
