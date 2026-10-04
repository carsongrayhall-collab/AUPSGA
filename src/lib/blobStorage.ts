import "server-only";

export type BlobCredentialOptions = {
  token?: string;
};

export function getBlobCommandOptions(): BlobCredentialOptions | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  if (token) {
    return { token };
  }

  if (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID) {
    return {};
  }

  return null;
}
