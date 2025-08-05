import cloudinary from "../lib/cloudinary.js"

const uploadIconToCloudinary = async (iconData) => {
    try {
        const result = await cloudinary.uploader.upload(iconData, {
            folder: 'facilities/icons',
            resource_type: 'image',
            transformation: [
                { width: 64, height: 64, crop: 'fill', quality: 'auto' }
            ]
        });
        return result.secure_url;
    } catch (error) {
        throw new Error(`Icon upload failed: ${error.message}`);
    }
};

const deleteIconFromCloudinary = async (iconUrl) => {
    try {
        const publicId = iconUrl.split('/').pop().split('.')[0];
        const folderPath = iconUrl.includes('/facilities/icons/') ? 'facilities/icons/' + publicId : publicId;
        await cloudinary.uploader.destroy(folderPath)
    } catch (error) {
        console.error('Error deleting icon from Cloudinary:', error.message);
    }
}