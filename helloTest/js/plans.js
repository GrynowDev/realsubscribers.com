document.getElementById("promo-code-section").style.display = "none";
document.getElementById("plan-1500").style.display = "none";
document.getElementById("plan-1000").style.display = "none"; 

console.log("localStorage.getItem ", localStorage.getItem("user"));
if (localStorage.getItem("user") !== null) {
    document.getElementById("register-login").style.display = "none"; 
    document.getElementById("welcome-youtuber").style.display = "block"; 
} else {
    document.getElementById("welcome-youtuber").style.display = "none"; 
    document.getElementById("register-login").style.display = "block";
}

function showPromoCode() {
    const promoCode = document.getElementById("promo-code-section");
    if (promoCode.style.display === "none") {
        promoCode.style.display = "block";
    } else {
        promoCode.style.display = "none";
    }
}

function logoutUser() {
    localStorage.setItem("user", null);
    window.location.href = "login.html";
}

function applyPromoCode() {
    const promoCode = document.getElementById("promoCode").value;
    let price = document.getElementById("promo-code-price");
    if (promoCode === "RSG25") {        
        price.innerHTML = 2000 - 2000 * 25 / 100;
        document.getElementById("plan-1000").style.display = "none";
        document.getElementById("plan-2000").style.display = "none";
        document.getElementById("plan-1500").style.display = "block";
        return;
    }
    if (promoCode === "RSG50") {        
        price.innerHTML = 2000 * 50 / 100;
        document.getElementById("plan-1000").style.display = "block";
        document.getElementById("plan-2000").style.display = "none";
        document.getElementById("plan-1500").style.display = "none";
    } else {
        document.getElementById("plan-2000").style.display = "block";
        document.getElementById("plan-1000").style.display = "none";
        document.getElementById("plan-1500").style.display = "none";
    }
}