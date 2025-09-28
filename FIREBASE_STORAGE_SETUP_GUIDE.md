# Firebase Storage Setup Guide

## 🚨 Important: Firebase Storage Not Enabled

Your Firebase project `studybuddy-d1751` doesn't have Storage enabled yet. Here's how to set it up:

## Step 1: Enable Firebase Storage

1. **Go to Firebase Console**:
   - Visit: https://console.firebase.google.com/project/studybuddy-d1751/storage
   - Or go to https://console.firebase.google.com/ → Select your project → Storage

2. **Click "Get Started"**:
   - You'll see a "Get Started" button
   - Click it to initialize Firebase Storage

3. **Choose Security Rules**:
   - Select "Start in test mode" for now (we'll update with proper rules)
   - Or select "Start in production mode" if you want to be more restrictive

4. **Select Location**:
   - Choose the same region as your Firestore database
   - This ensures low latency between your database and storage

5. **Click "Done"**

## Step 2: Deploy Storage Rules

Once Storage is enabled, run this command to deploy the security rules:

```bash
firebase deploy --only storage
```

## Step 3: Verify Setup

1. **Check Firebase Console**:
   - Go to Storage → Rules
   - Verify the rules are deployed correctly

2. **Test File Upload**:
   - Try uploading a file in your application
   - Check that it appears in the Storage bucket

## Alternative: Manual Rule Setup

If the CLI deployment doesn't work, you can manually copy the rules:

1. **Go to Firebase Console** → Storage → Rules
2. **Copy the rules from `storage.rules` file**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Past Papers - Only admins can upload, everyone can read
    match /past-papers/{fileName} {
      // Allow read access to all authenticated users
      allow read: if request.auth != null;
      
      // Only allow write access to admin users
      allow write: if request.auth != null 
        && request.auth.token.admin == true;
    }
    
    // Help Requests - Students can upload their own files, tutors can read
    match /help-requests/{studentId}/{fileName} {
      // Allow students to upload their own files
      allow create: if request.auth != null 
        && request.auth.uid == studentId;
      
      // Allow students to read their own files
      allow read: if request.auth != null 
        && (request.auth.uid == studentId || request.auth.token.tutor == true);
      
      // Allow students to delete their own files
      allow delete: if request.auth != null 
        && request.auth.uid == studentId;
    }
    
    // AI Tutor Images - Users can upload their own images
    match /ai-tutor-images/{fileName} {
      // Allow authenticated users to upload and read their own images
      allow read, write: if request.auth != null;
    }
    
    // Profile Images - Users can manage their own profile images
    match /profile-images/{userId}/{fileName} {
      // Allow users to manage their own profile images
      allow read, write, delete: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    // General file uploads - authenticated users only
    match /uploads/{userId}/{fileName} {
      // Allow users to manage their own uploads
      allow read, write, delete: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    // Deny all other paths
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

3. **Paste and Publish**

## Step 4: Test Your Application

Once Storage is set up and rules are deployed:

1. **Test Admin Upload**: Try uploading a past paper as an admin
2. **Test Student Upload**: Try submitting a help request with a file
3. **Verify Security**: Make sure unauthorized users can't access files they shouldn't

## Troubleshooting

### If you get "Storage not enabled" error:
- Make sure you completed Step 1 above
- Wait a few minutes for the API to fully enable

### If rules deployment fails:
- Use the manual method in Step 3
- Check that your Firebase CLI is logged in: `firebase login`

### If file uploads fail:
- Check browser console for errors
- Verify the storage bucket URL in your Firebase config
- Make sure the user is authenticated

## Next Steps After Setup

1. **Set Custom Claims**: You'll need to set admin/tutor claims for users
2. **Test File Uploads**: Verify all file types work correctly
3. **Monitor Usage**: Check Firebase Console for storage usage and costs

## Cost Considerations

Firebase Storage pricing:
- **Storage**: $0.026/GB/month
- **Downloads**: $0.12/GB
- **Operations**: $0.05/10,000 operations

For an educational platform, costs should be minimal unless you have very high usage.
