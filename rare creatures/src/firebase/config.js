import { initializeApp } from "firebase/app"
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyD6D53bEhi_KIWUvZkdTvWOcS3J_QjVCuI",
  authDomain: "auth-for-my-web-app.firebaseapp.com",
  projectId: "auth-for-my-web-app",
  storageBucket: "auth-for-my-web-app.firebasestorage.app",
  messagingSenderId: "593712917212",
  appId: "1:593712917212:web:6aa974304dd66b56f16219",
  measurementId: "G-TB2LTMSCN2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)