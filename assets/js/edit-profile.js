// clearData() funtion helps to logout the user

function clearData() {
  localStorage.removeItem("userEmail");
}

// it helps to get a data from local storage

let userData = JSON.parse(window.localStorage.getItem("signinData"));
let user = window.localStorage.getItem("userEmail");

if (user === null) {
  window.location.href = "../SignIn_login/login.html";
}

let profiles;
let team;
for (let i = 0; i < userData.length; i++) {
  let valid = userData[i]["members"].find(
    (validation) => user === validation["email"]
  );
  if (valid !== undefined) {
    team = userData[i];
    profiles = valid;
  }
}
document
  .querySelector(".profile-logo")
  .setAttribute("src", profiles["profileLink"]);
// console.log(profiles, team);
let image = document
  .querySelector(".profile-image")
  .setAttribute("src", profiles.profileLink);
let userName = document.querySelector(".profile-name");
userName.innerText = profiles.name;
let key = document.querySelector(".key");
key.innerText = team.channal;
let names = profiles.name.split(" ");
document.querySelector(".name-input").value = names[0];
document.querySelector(".last-name-input").value = names[1];
document.querySelector(".email").value = profiles.email;
document.querySelector(".org-input").value = team.org;
document.querySelector(".position-input").value = profiles.position;
let source;

document.querySelector("#add-pic").onclick = () => {
  const fileInput = document.getElementById("file-input");
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Replace with your upload preset name
    fetch("https://api.cloudinary.com/v1_1/defftwb18/auto/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        source = data.url;
        console.log(source);
      })
      .catch((error) => console.error(error));
  });
};
document.querySelector("#del-pic").onclick = () => {
  if (window.confirm("Do want to delete Your profile picture ?")) {
    source = "../../assets/images/blank-profile-picture-973460_1280.webp";
  }
};

document.getElementById("save-btn").onclick = () => {
  let obj = new Object();
  obj["name"] =
    document.querySelector(".name-input").value +
    " " +
    document.querySelector(".last-name-input").value;
  obj["email"] = document.querySelector(".email").value.toLowerCase();
  if (source !== undefined) {
    obj["profileLink"] = source;
  }
  console.log(obj);
  if (obj["email"] === null) {
    return alert("Please Enter the email");
  } else {
    let localData = Object.assign(profiles, obj);
    let dataIndex = team["members"].indexOf(profiles);
    let teamIndex = userData.indexOf(team);
    team["members"][dataIndex] = localData;
    userData[teamIndex] = team;
    window.localStorage.setItem("signinData", JSON.stringify(userData));
    window.localStorage.setItem("userEmail", obj["email"]);
    window.location.href = "./profile.html";
    alert("success fully updated");
  }
};
