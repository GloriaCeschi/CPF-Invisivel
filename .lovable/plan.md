

## Problem

The files `src/utils/supabase.ts` and `src/integrations/supabase/client.ts` both use a hardcoded key `sb_publishable_7Vc1b6AvxvgJfs8P6HhpkA_dfDKaeKF` which is **not a valid Supabase anon key**. The correct key (a JWT token starting with `eyJhbG...`) is already in the `.env` file but is not being used.

This means ALL Supabase operations (auth, storage upload, database queries) are likely failing or behaving unexpectedly.

Additionally, there's a minor code bug: `data.path` is accessed before checking if `data` is null (line 96), which would crash if the upload fails.

## Plan

### Step 1: Fix Supabase client files to use environment variables

Update both `src/utils/supabase.ts` and `src/integrations/supabase/client.ts` to read from `import.meta.env` instead of hardcoded invalid keys:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
```

### Step 2: Fix null-safety in Profile.tsx upload handler

Move the `data.path` console log after the null check on line 96 to prevent crashes when upload fails.

### Technical Details

- The `.env` already has the correct values (`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`)
- The storage bucket `avatars` exists and is public
- RLS policies for storage INSERT and SELECT are correctly configured for authenticated users
- No database or bucket changes needed

