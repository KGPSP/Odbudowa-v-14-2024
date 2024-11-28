// Add to claimRepository
async generateClaimNumber(): Promise<string> {
  const result = await db.execute(
    "SELECT COUNT(*) as count FROM claims WHERE strftime('%Y', createdAt) = strftime('%Y', 'now')"
  );
  const count = (result.rows[0] as { count: number }).count + 1;
  const year = new Date().getFullYear();
  return `${count.toString().padStart(6, '0')}/${year}`;
},

async saveFile(file: ClaimFile): Promise<void> {
  await db.execute({
    sql: `INSERT INTO claim_files (
      id, claimId, type, name, size, mimeType, url, uploadedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      file.id,
      file.claimId,
      file.type,
      file.name,
      file.size,
      file.mimeType,
      file.url,
      file.uploadedAt
    ]
  });
},

async getFiles(claimId: string): Promise<ClaimFile[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM claim_files WHERE claimId = ?',
    args: [claimId]
  });
  return result.rows as ClaimFile[];
}