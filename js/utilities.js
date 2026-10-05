const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");

hamburger.addEventListener("click",function(){
    mobileMenu.classList.toggle("active");
});