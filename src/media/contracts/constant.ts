export enum MediaType {
  authenticated = 'authenticated', // Original assets and all their asset derivations are only accessible through signed URLs.
  upload = 'upload' // The asset is publicly available. This is the default type when uploading files.
}
