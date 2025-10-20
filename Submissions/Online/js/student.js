const myCourses = [
  { title: "JavaScript Basics", progress: 80 },
  { title: "UI/UX Design", progress: 45 },
  { title: "Webdevelopment", progress: 90 },
  { title: "Graphics", progress: 75 },
  { title: "Python for Data Science", progress: 60 },
];

const container = document.getElementById("my-courses");
myCourses.forEach(c => {
  const div = document.createElement("div");
  div.classList.add("progress-card");
  div.innerHTML = `
    <h3>${c.title}</h3>
    <div class="progress-bar">
      <div class="progress" style="width:${c.progress}%;"></div>
    </div>
    <p>${c.progress}% Completed</p>
  `;
  container.appendChild(div);
});
