// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_3amiAIRU4iGjSLcQtCcQnBUCZ8IiWQk",
  authDomain: "jokii-d7641.firebaseapp.com",
  databaseURL: "https://jokii-d7641-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jokii-d7641",
  storageBucket: "jokii-d7641.firebasestorage.app",
  messagingSenderId: "449020905939",
  appId: "1:449020905939:web:04b9268f22911ebee0c726"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
