import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC8UmPkL9-AgrlPRPERwkYJ5uzTYX1fmDY",
  authDomain: "test-yourself-6afaa.firebaseapp.com",
  databaseURL: "https://test-yourself-6afaa-default-rtdb.firebaseio.com",
  projectId: "test-yourself-6afaa",
  storageBucket: "test-yourself-6afaa.firebasestorage.app",
  messagingSenderId: "886218676173",
  appId: "1:886218676173:web:6000c95948433e89d1d684"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const phoneBtn = document.getElementById("phoneBtn");
const whatsappBtn = document.getElementById("whatsappBtn");

onValue(ref(db, "settings/siteInfo"), snapshot => {
  if(snapshot.exists()) {
    const data = snapshot.val();
    const phone = data.phone || "#";
    const whatsapp = data.whatsapp || "#";

    phoneBtn.href = `tel:${phone}`;
    phoneBtn.textContent = `📱 الهاتف: ${phone}`;

    whatsappBtn.href = `https://wa.me/${whatsapp.replace(/\D/g,'')}`;
    whatsappBtn.textContent = `💬 واتساب: ${whatsapp}`;
  }
});
