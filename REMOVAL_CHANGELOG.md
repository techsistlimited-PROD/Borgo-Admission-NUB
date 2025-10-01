# Removal of registration-system artifacts

This changelog records the removal (backup) of registration-system related folders and public registration assets.

Timestamp: REPLACE_TIMESTAMP

Moved to backup folder: removed_registration_backup_REPLACE_TIMESTAMP

Items moved:

- registration-system/
- registration-system-standalone/
- public/registration/

Notes:
- These folders were split-out and are not part of the core admission repo. They were backed up in the above path.
- If you want them permanently deleted, remove the backup folder after verification.

Commit message suggested:

chore: remove registration-system artifacts and backup removed files

PR title suggested:

chore: remove registration-system modules and public registration assets

PR body (short):

The registration-system and registration-system-standalone folders, along with public/registration assets, were removed from the repository and moved to a backup directory (removed_registration_backup_<timestamp>). These modules are unrelated to the core admission system and were causing confusion. They can be restored from the backup if needed.
