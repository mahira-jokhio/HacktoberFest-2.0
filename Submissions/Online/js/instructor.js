const form = document.getElementById("add-course-form");
const instructorCourses = document.getElementById("instructor-courses");
let addedCourses = [];

form.addEventListener("submit", e => {
  e.preventDefault();
  const course = {
    title: form.title.value,
    duration: form.duration.value,
    level: form.level.value,
    category: form.category.value
  };
  addedCourses.push(course);
  displayCourses();
  form.reset();
});

function displayCourses() {
  instructorCourses.innerHTML = "";
  addedCourses.forEach((c, i) => {
    const div = document.createElement("div");
    div.classList.add("course-card");
    div.innerHTML = `
      <h3>${c.title}</h3>
      <p>${c.duration} | ${c.level} | ${c.category}</p>
      <button onclick="deleteCourse(${i})">Delete</button>
    `;
    instructorCourses.appendChild(div);
  });
}

function deleteCourse(index) {
  addedCourses.splice(index, 1);
  displayCourses();
}
