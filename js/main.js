window.addEventListener("scroll", function (e) {
    let nav = document.getElementsByClassName("bg__nav")[0];
    if (window.scrollY > 50) {
        nav.classList.remove("bg-transparent");
        nav.classList.add("bg-[#0a1e5e]");
    }
    else {
        nav.classList.remove("bg-[#0a1e5e]");
        nav.classList.add("bg-transparent");
    }
})
changeLogin = ()=>{
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("tittle").innerHTML=  `welcome back`;
}
changeRegister = ()=>{
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("registerForm").classList.remove("hidden");
        document.getElementById("tittle").innerHTML=  `Register now`;
}