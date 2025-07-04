# Database Migration

To perform a data migration, you need to follow this guide:

- in `functions/src/migrations/models` you should add the *current* versions of the data models, prefixed with a new version number.
  - Fx. if you need to update the group object, copy and paste it from `functions/src/interfaces/models`, rename it `group_vX+1` and update the group object. This is now the latest version.
- Update everywhere in the code where the object is used. Use the linter to check for errors.
- Create a new migration folder, name it so it follow the scheme `vX_vX+1`.
- In the migration folder, create migration functions for each object that has been updated. Do not create functions for unchanged objects.
- In the migration folder, create a migrator class that inherits from the latest migrator abstract class. Import the migrator new functions and insert them where needed.
- Create a migration function the that takes a express `Response` object, create a new instance of the migrator, run `migrate` and return 200-OK via the Response.


## addendums
- Every migration needs a version number. This version represents the current version of the entire database schema. Every collection also has its own version, so every time one of these versions are updated, so is the migration version.