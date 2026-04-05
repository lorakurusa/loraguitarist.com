/**Nav java**/
const hamburger = document.getElementById("hamburger");
const mobilePanel = document.getElementById("mobilePanel");

hamburger.addEventListener("click", () => {
  mobilePanel.classList.toggle("show");
});
