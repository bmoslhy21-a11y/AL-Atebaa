import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC8UmPkL9-AgrlPRPERwkYJ5uzTYX1fmDY",
  authDomain: "test-yourself-6afaa.firebaseapp.com",
  databaseURL: "https://test-yourself-6afaa-default-rtdb.firebaseio.com",
  projectId: "test-yourself-6afaa",
  storageBucket: "test-yourself-6afaa.firebasestorage.app",
  messagingSenderId: "886218676173",
  appId: "1:886218676173:web:6000c95948433e89d1d684",
  measurementId: "G-SXBVYN9R4R"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const urlParams = new URLSearchParams(window.location.search);
const teacherId = urlParams.get("id");

const teacherRef = ref(db, `teachers/${teacherId}`);
const postsRef = ref(db, "posts");
const siteRef = ref(db, "siteInfo");

// بيانات المعلم
get(teacherRef).then(snapshot => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    document.getElementById("teacherImage").src = data.image || "default.jpg";
    document.getElementById("teacherName").textContent = data.name || "غير معروف";
    const rating = Math.round(Number(data.rating) || 0);
    document.getElementById("teacherRating").innerHTML = "⭐".repeat(rating);
  }
});

// منشورات المعلم
get(postsRef).then(snapshot => {
  if (!snapshot.exists()) return;
  const posts = snapshot.val();
  const container = document.getElementById("teacherPosts");
  container.innerHTML = "";
  Object.entries(posts).forEach(([id, post]) => {
    if (post.teacherId === teacherId) {
      const div = document.createElement("div");
      div.classList.add("post");

      let contentHTML = "";
      if (post.type === "image" && post.fileUrl) {
        contentHTML = `<img src="${post.fileUrl}" alt="صورة المنشور">`;
      } else if (post.type === "video" && post.fileUrl) {
        let videoId = "";
        try {
          const url = new URL(post.fileUrl);
          if (url.hostname.includes("youtube.com")) videoId = url.searchParams.get("v");
          else if (url.hostname.includes("youtu.be")) videoId = url.pathname.substring(1);
        } catch(e) { console.error(e); }
        contentHTML = videoId ? `<iframe width="100%" height="350" style="border:2px solid #FFD700;border-radius:10px;" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>` : `<p style="color:red;">الرابط غير صالح</p>`;
      } else if (post.type === "pdf" && post.fileUrl) {
        contentHTML = `<iframe src="${post.fileUrl}" width="100%" height="400px" style="border:2px solid #FFD700;border-radius:10px;"></iframe>`;
      } else {
        contentHTML = `<p>${post.content || ""}</p>`;
      }

      div.innerHTML = `<h3 style="color:#FFD700;">${post.title || "منشور بدون عنوان"}</h3>${contentHTML}`;
      container.appendChild(div);
      setTimeout(() => div.classList.add("visible"), 200);
    }
  });
});

// بيانات الفوتر
get(siteRef).then(snapshot => {
  if (!snapshot.exists()) return;
  const siteData = snapshot.val();
  document.getElementById("siteInfo").innerHTML = siteData.location ? `<p>📍 ${siteData.location}</p>` : "";
  const socialsContainer = document.getElementById("footerSocials");
  socialsContainer.innerHTML = "";
  if (siteData.socials) {
    Object.values(siteData.socials).forEach(social => {
      const a = document.createElement("a");
      a.href = social.link;
      a.target = "_blank";
      a.innerHTML = `<img src="${social.icon}" alt="${social.name}">`;
      socialsContainer.appendChild(a);
    });
  }
});
