# Webcam Photo Capture Setup Guide

## 📸 Features Implemented

1. **Webcam Integration**: Click on member profile photo to open webcam
2. **Photo Capture**: Take photo directly from webcam
3. **Photo Storage**: Save captured photo as base64 in database
4. **Photo Display**: Display captured photo in member profile
5. **Camera Switch**: Switch between front and back camera (mobile)

## 🚀 Installation Steps

### 1. Install Required Package

Run this command in the `client` directory:

```bash
npm install react-webcam
```

Or with yarn:

```bash
yarn add react-webcam
```

### 2. Install Type Definitions (Optional)

```bash
npm install --save-dev @types/react-webcam
```

## 📁 Files Created/Modified

### Created Files:

1. **`client/src/components/WebcamCapture/WebcamCapture.tsx`**
   - Webcam capture modal component
   - Features:
     - Live webcam preview
     - Capture button
     - Retake functionality
     - Save functionality
     - Camera switching (front/back)

2. **`client/src/graphql/Customer/UpdateCustomerPhoto.tsx`**
   - GraphQL mutation for updating customer photo

3. **`server/src/Resolvers/Customer.ts`** (Modified)
   - Added `UpdateCustomerPhoto` mutation
   - Handles photo update in database

### Modified Files:

4. **`client/src/pages/Member/Profile/MemberProfile/MemberProfile.tsx`**
   - Added webcam modal integration
   - Click on photo to open webcam
   - Photo capture handler
   - Display captured photo

## 🎯 How It Works

### User Flow:

1. **Click Photo**: User clicks on member profile picture
2. **Webcam Opens**: Modal opens with webcam preview
3. **Capture**: User clicks "ថតរូប" (Take Photo) button
4. **Review**: Preview the captured photo
5. **Save or Retake**: 
   - Click "រក្សាទុក" (Save) to save the photo
   - Click "ថតម្តងទៀត" (Retake) to capture again
6. **Display**: Photo is saved and displayed in profile

### Technical Flow:

1. Photo is captured as base64 string
2. Sent to GraphQL mutation `UpdateCustomerPhoto`
3. Stored in `Customer.image_path` column
4. Displayed using the stored base64 string

## 📊 Database Schema

The photo is stored in the existing `Customer` table:

```sql
Customer {
  ...
  image_path: string  -- Stores base64 image data
  ...
}
```

## 🔧 Component Usage

```tsx
<WebcamCapture
  open={open_webcam}
  setOpen={setOpenWebcam}
  onCapture={handlePhotoCapture}
  customerId={customerId}
/>
```

### Props:
- `open`: Boolean to control modal visibility
- `setOpen`: Function to set modal visibility
- `onCapture`: Callback function when photo is captured
- `customerId`: ID of the customer (optional, for future use)

## 🎨 Features

### Desktop:
- Click on profile photo to open webcam
- Capture photo with "ថតរូប" button
- Preview and save or retake
- Hover effect on photo shows camera icon

### Mobile:
- Tap on profile photo to open webcam
- Switch between front/back camera
- Same capture/save/retake flow

## 🔐 Permissions

The app will request camera permissions when:
- User clicks on profile photo for the first time
- Browser will show permission prompt

## 📝 Notes

### Image Storage:
- Photos are stored as **base64 strings** in the database
- No file system storage required
- Immediately available after capture

### Alternative Storage Options:

If you want to store photos as files instead:

1. **Local File System**:
   ```typescript
   // Save to server's public folder
   const filename = `${customerId}_${Date.now()}.jpg`;
   const filepath = `/uploads/photos/${filename}`;
   ```

2. **Cloud Storage** (AWS S3, Google Cloud Storage):
   ```typescript
   // Upload to cloud and store URL
   const imageUrl = await uploadToS3(base64Image);
   ```

3. **Current Implementation (Base64)**:
   - Pros: Simple, no file management, immediate availability
   - Cons: Larger database size for many photos
   - Recommended for: Small to medium number of users

## 🐛 Troubleshooting

### Camera Not Working:
1. Check browser permissions
2. Ensure HTTPS (required for webcam access)
3. Check if camera is available and not used by another app

### Photo Not Saving:
1. Check GraphQL mutation response
2. Verify database connection
3. Check console for errors

### Photo Not Displaying:
1. Verify `image_path` is being set
2. Check if base64 string is valid
3. Ensure `refetchMemberDetail()` is called after save

## 🚀 Testing

1. Navigate to member profile
2. Click on profile photo
3. Allow camera permissions if prompted
4. Click "ថតរូប" to capture
5. Click "រក្សាទុក" to save
6. Verify photo displays in profile

## 📱 Browser Compatibility

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile - iOS 11+)
- ⚠️ Requires HTTPS (except localhost)

## 🔄 Future Enhancements

Possible improvements:
1. Image compression before saving
2. Multiple photo support
3. Photo editing (crop, rotate)
4. Photo gallery view
5. Upload from file system
6. Delete photo option
7. Photo history/versions
