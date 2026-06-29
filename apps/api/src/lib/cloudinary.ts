/**
 * Cloudinary integration.
 *
 * Cloudinary is our free media host for uploaded images (verification
 * documents and avatars). Credentials come exclusively from environment
 * variables (never hard-coded). This module is the single place that talks to
 * Cloudinary (DRY): one helper to upload a buffer, one to delete by public id.
 */
import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

export interface UploadedImage {
  url: string; // secure https URL stored in the database
  publicId: string; // Cloudinary id, used if we later need to delete it
}

/** Uploads an image buffer to a folder and returns its URL + public id. */
export function uploadImage(buffer: Buffer, folder: string): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error('Cloudinary upload failed'));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(buffer);
  });
}

/** Deletes an image by its Cloudinary public id. */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
