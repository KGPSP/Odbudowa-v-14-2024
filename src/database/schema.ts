// Add new table for files
await db.execute(`
  CREATE TABLE IF NOT EXISTS claim_files (
    id TEXT PRIMARY KEY,
    claimId TEXT NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    size INTEGER NOT NULL,
    mimeType TEXT NOT NULL,
    url TEXT NOT NULL,
    uploadedAt TEXT NOT NULL,
    FOREIGN KEY (claimId) REFERENCES claims(id)
  )
`);