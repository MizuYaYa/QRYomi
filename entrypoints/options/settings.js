const sidebar_close_btn = document.getElementById("sidebar_close_btn");
const sidebar_open_btn = document.getElementById("sidebar_open_btn");
const sidebar = document.getElementById("sidebar");

sidebar_close_btn.addEventListener("click", () => {
  sidebar.classList.add("sidebar_closed");
  sidebar_open_btn.style.visibility = "visible";
});

sidebar_open_btn.addEventListener("click", () => {
  sidebar_open_btn.style.visibility = "";
  sidebar.classList.remove("sidebar_closed");
});
