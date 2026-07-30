/**
 * GBM School Website - Firebase Configuration
 * Initialize Firebase services
 */

// Firebase Configuration
// IMPORTANT: Replace these values with your actual Firebase project config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Firestore Settings
db.settings({
    timestampsInSnapshots: true
});

// Export for use in other files
window.firebaseApp = {
    auth,
    db,
    storage,
    firebase
};

// Authentication State Observer
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User signed in:', user.email);
        window.currentUser = user;
    } else {
        console.log('User signed out');
        window.currentUser = null;
    }
});

// Helper Functions
const FirebaseHelper = {
    // Check if user is authenticated
    isAuthenticated: () => {
        return auth.currentUser !== null;
    },

    // Get current user
    getCurrentUser: () => {
        return auth.currentUser;
    },

    // Sign in with email and password
    signIn: async (email, password) => {
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Sign out
    signOut: async () => {
        try {
            await auth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Reset password
    resetPassword: async (email) => {
        try {
            await auth.sendPasswordResetEmail(email);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Add document to Firestore
    addDocument: async (collection, data) => {
        try {
            const docRef = await db.collection(collection).add({
                ...data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update document in Firestore
    updateDocument: async (collection, id, data) => {
        try {
            await db.collection(collection).doc(id).update({
                ...data,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete document from Firestore
    deleteDocument: async (collection, id) => {
        try {
            await db.collection(collection).doc(id).delete();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get document by ID
    getDocument: async (collection, id) => {
        try {
            const doc = await db.collection(collection).doc(id).get();
            if (doc.exists) {
                return { success: true, data: { id: doc.id, ...doc.data() } };
            }
            return { success: false, error: 'Document not found' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get all documents from collection
    getCollection: async (collection, orderByField = 'createdAt', orderDirection = 'desc', limit = 100) => {
        try {
            const snapshot = await db.collection(collection)
                .orderBy(orderByField, orderDirection)
                .limit(limit)
                .get();
            
            const documents = [];
            snapshot.forEach(doc => {
                documents.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, data: documents };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Query collection
    queryCollection: async (collection, field, operator, value) => {
        try {
            const snapshot = await db.collection(collection)
                .where(field, operator, value)
                .get();
            
            const documents = [];
            snapshot.forEach(doc => {
                documents.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, data: documents };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Upload file to Firebase Storage
    uploadFile: async (file, path) => {
        try {
            const storageRef = storage.ref();
            const fileRef = storageRef.child(path);
            const uploadTask = await fileRef.put(file);
            const downloadURL = await uploadTask.ref.getDownloadURL();
            return { success: true, url: downloadURL };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete file from Firebase Storage
    deleteFile: async (path) => {
        try {
            const storageRef = storage.ref();
            const fileRef = storageRef.child(path);
            await fileRef.delete();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Real-time listener for collection
    listenToCollection: (collection, callback, orderByField = 'createdAt', orderDirection = 'desc') => {
        return db.collection(collection)
            .orderBy(orderByField, orderDirection)
            .onSnapshot(snapshot => {
                const documents = [];
                snapshot.forEach(doc => {
                    documents.push({ id: doc.id, ...doc.data() });
                });
                callback(documents);
            });
    },

    // Real-time listener for document
    listenToDocument: (collection, id, callback) => {
        return db.collection(collection).doc(id)
            .onSnapshot(doc => {
                if (doc.exists) {
                    callback({ id: doc.id, ...doc.data() });
                } else {
                    callback(null);
                }
            });
    }
};

// Make helper available globally
window.FirebaseHelper = FirebaseHelper;

console.log('Firebase initialized successfully');
