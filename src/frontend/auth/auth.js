import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";


const firebaseConfig = {
  // Your Firebase project configuration
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence to 'session'
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Authentication state persistence set successfully
  })
  .catch((error) => {
    // Error occurred while setting persistence
    console.error("Error setting persistence:", error);
  });


  function getEmailOfAuthenticatedUser(auth) {
    return new Promise((resolve, reject) => {
        const user = auth.currentUser;
        if (user) {
            resolve(user.email);
        } else {
            reject(new Error('No authenticated user found.'));
        }
    });
}

export function getEmailOfAuthenticatedUser();