// Import the functions you need from the SDKs you need using full CDN URLs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgL2jkytPV6jW5mn_qG0L-ibS8OTIuaDA",
  authDomain: "project-management-syste-51986.firebaseapp.com",
  databaseURL: "https://project-management-syste-51986-default-rtdb.firebaseio.com",
  projectId: "project-management-syste-51986",
  storageBucket: "project-management-syste-51986.firebasestorage.app",
  messagingSenderId: "622256735016",
  appId: "1:622256735016:web:2756a02e3d5541ed65861d",
  measurementId: "G-0STK8W9M4L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export the appId from the config
const appId = firebaseConfig.appId;

// Export the services so they can be imported by other files
export { auth, db, appId, app, analytics };