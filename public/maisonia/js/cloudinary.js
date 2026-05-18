// ===== Cloudinary unsigned upload helper =====
// Works in any environment (localhost, GitHub Pages, custom domain)
// because it uses a public unsigned upload preset (no API key needed).
export const CLOUDINARY_CLOUD = 'dsk0hs1sc';
export const CLOUDINARY_PRESET = 'maisonia_upload';

export async function uploadToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && res.secure_url) {
          resolve(res.secure_url);
        } else {
          reject(new Error(res.error?.message || `Upload failed (${xhr.status})`));
        }
      } catch (err) {
        reject(new Error('Invalid Cloudinary response'));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(fd);
  });
}
