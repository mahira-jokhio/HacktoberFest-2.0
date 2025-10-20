const courses = [
  { title: "JavaScript Basics", duration: "4 Weeks", level: "Beginner", category: "Programming" },
  { title: "UI/UX Design", duration: "6 Weeks", level: "Intermediate", category: "Design" },
  { title: "Digital Marketing", duration: "5 Weeks", level: "Beginner", category: "Business" }
];

const courseList = document.getElementById("course-list");

courses.forEach(course => {
  const div = document.createElement("div");
  div.classList.add("course-card");
  div.innerHTML = `
    <h3>${course.title}</h3>
    <p>Duration: ${course.duration}</p>
    <p>Level: ${course.level}</p>
    <p>Category: ${course.category}</p>
    <button onclick="enroll('${course.title}')">Enroll</button>
  `;
  courseList.appendChild(div);
});

function enroll(courseName) {
  alert(`You have enrolled in ${courseName}!`);
}
