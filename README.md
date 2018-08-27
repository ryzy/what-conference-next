# What Conference Next
[![CircleCI](https://circleci.com/gh/ryzy/what-conference-next.svg?style=svg)](https://circleci.com/gh/ryzy/what-conference-next)

Curated list of technical conferences and events. 
Speakers support with call-for-paper dates (CFP). 
Find the next best conference for you to attend here.

**Technology stack**: Angular, MongoDB Stitch (for server-less backend),
Firebase Hosting.

## Development

* `yarn install`
* `yarn start`
* http://localhost:4100/

Then
* `yarn test`
* `yarn e2e`

### Keeping MongoDB Stitch dev and prod apps in sync

[MongoDB Stitch](https://docs.mongodb.com/stitch/) Apps are exported 
to `stitch/*/` directories, for dev and prod environments separately. 
Why separately? Seems like IDs (for stitch entities) 
between apps must be unique, so when overriding/importing
the settings, we must have old values. We could just re-import data
from another environments (with strategy=replace), but that replaces
all entities, incl. auth-providers. Replacing auth-provider entity
results with all auth and API tokens being invalidated. That's not good.
So we keep it separate and prepare import/export as we need, diffing
and syncing things semi-manually.

Here's quick recipe for migrating settings from DEV to PROD env:

1. You have changes in in DEV Stitch App
2. Have all changes in the files: `yarn stitch:export:dev`
3. Verify it's all good there, that there's _no accidental
   changes in roles_, especially!
4. Stage/commit your changes
3. Compare/diff/select changes which you want in PROD environment.
   * you can *select the two directories with stitch app configs*
     using IDEs **Compare Directories** function.
   * select appropriate changes which you want to keep in sync
     with
   * don't override IDs during that process. They need to be kept
     unchanged (unless it's a new entity of course - then the
     import tool will generate a new ID anyway)
   * **don't override production-specific settings**: domain names,
     database names etc...
4. Stage/commit your changes (so you can spot any changes the import
   might do)
5. Re-create `secret.json` if needed (you know/kept the content
   somewhere safe, right?)
6. `stitch:deploy:prod` to import your prepared changes to PROD.
7. `stitch:deploy:dev` - just to check that you really have all
   changes kept in sync.

If you need to go the other way around, you have respective
yarn commands for that too (e.g. `yarn stitch:export:prod`).

---
