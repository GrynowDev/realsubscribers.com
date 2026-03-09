const toggleDropdown = () => {
    const el = ["dropdown-wrapper", "dropdown-wrapper-content"];
    el.forEach((e) => document.getElementById(e).classList.toggle("show"));
}