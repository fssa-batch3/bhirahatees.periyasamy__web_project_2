// getting a value from url parms
const url = window.location.search;
const urlParms = new URLSearchParams(url);
const ticketId = parseInt(urlParms.get("id"));
const commentData = JSON.parse(localStorage.getItem("comment"));
let userData = JSON.parse(window.localStorage.getItem("signinData"));
let user = window.localStorage.getItem("userEmail")
if (user === null) {
  window.location.href = "../SignIn_login/login.html";
}
let profiles;
let team;
let index;

// geting a data from local storage
for (let i = 0; i < userData.length; i++) {
  let valid = userData[i]["members"].find(
    (validation) => user === validation["email"]
  );
  if (valid !== undefined) {
    team = userData[i];
    profiles = valid;
    index = i;
  }
}
function clearData() {
  localStorage.removeItem("userEmail");
}
document
  .querySelector(".profile-logo")
  .setAttribute("src", profiles["profileLink"]);
// finding which ticket we show
let tickets = team["closedTickets"];

let ticketPre = tickets.find((e) => e["id"] === ticketId);
// console.log(tickets);

// console.log(tickets, ticketId);

// console.log(ticketPre);

// listing Ticket function
let raiser = team["members"].find((e) => e["email"] === ticketPre["from"]);

function listTicket(raiser, ticket, response) {
  let singleContainer = document.createElement("div");
  singleContainer.classList.add("single-ticket-container");
  let nameAndProfPic = document.createElement("div");
  nameAndProfPic.classList.add("name-profile");
  let profilePic = document.createElement("img");
  profilePic.setAttribute("src", raiser["profileLink"]);
  profilePic.classList.add("profile-logo", "profile");
  nameAndProfPic.append(profilePic);
  let raiserName = document.createElement("div");
  raiserName.classList.add("ticket-name");
  raiserName.innerText = raiser["name"];
  let ticketId = document.createElement("div");
  ticketId.classList.add("ticket-id");

  ticketId.innerText = "#" + ticket["id"];
  raiserName.append(ticketId);
  nameAndProfPic.append(raiserName);
  singleContainer.append(nameAndProfPic);

  let subjectContainer = document.createElement("div");
  subjectContainer.classList.add("subject-container");
  let subjectTitle = document.createElement("div");
  subjectTitle.classList.add("ticket-subject");
  subjectTitle.innerText = "Subject :";
  subjectContainer.append(subjectTitle);
  let subject = document.createElement("div");
  subject.classList.add("ticket-issue");
  subject.innerText = ticket["summary"];
  subjectContainer.append(subject);
  singleContainer.append(subjectContainer);

  if (response === "reply") {
    let lines = ticket["reply"].split(",");
    let description = document.createElement("p");
    description.classList.add("description");
    let desc = "";
    for (let i = 0; i < lines.length; i++) {
      desc += lines[i] + "\n";
    }
    subjectContainer.remove();
    description.innerText = desc;
    singleContainer.append(description);
  } else {
    let lines = ticket["description"].split(",");
    let description = document.createElement("p");
    description.classList.add("description");
    let desc = "";
    for (let i = 0; i < lines.length; i++) {
      desc += lines[i] + "\n";
    }

    description.innerText = desc;
    singleContainer.append(description);
  }

  let priorityAndStatus = document.createElement("div");
  priorityAndStatus.classList.add("proirity-status");

  let statusContainer = document.createElement("div");
  statusContainer.classList.add("status-container");
  let statusTitle = document.createElement("div");
  statusTitle.classList.add("status");
  statusTitle.innerText = "Status :";
  statusContainer.append(statusTitle);
  let status = document.createElement("div");
  status.classList.add("ticket-status");
  status.innerText = ticket["status"];
  statusContainer.append(status);
  priorityAndStatus.append(statusContainer);

  let priorityContainer = document.createElement("div");
  priorityContainer.classList.add("proirity-container");
  let priorityTitle = document.createElement("div");
  priorityTitle.classList.add("proirity");
  priorityTitle.innerText = "Priority :";
  priorityContainer.append(priorityTitle);
  let priority = document.createElement("div");
  priority.classList.add("ticket-priority");
  priority.innerText = ticket["priority"];
  let prioritySignal = document.createElement("div");
  if (ticket["priority"] === "High") {
    prioritySignal.classList.add("high--priority");
  } else if (ticket["priority"] === "Medium") {
    prioritySignal.classList.add("medium-priority");
  } else {
    prioritySignal.classList.add("low-priority");
  }
  priority.append(prioritySignal);
  priorityContainer.append(priority);
  priorityAndStatus.append(priorityContainer);
  singleContainer.append(priorityAndStatus);

  let timeAndDateContainer = document.createElement("div");
  timeAndDateContainer.classList.add("time-date");
  singleContainer.append(timeAndDateContainer);
  let date = document.createElement("p");
  date.classList.add("create-date");
  date.innerText =
    `Created On  ${new Date(ticket["id"]).toLocaleDateString()}  ${new Date(
      ticket["id"]
    ).toLocaleTimeString()}` +
    "\n\n" +
    `Closed On  ${new Date(
      ticket["closeTime"]
    ).toLocaleDateString()}  ${new Date(
      ticket["closeTime"]
    ).toLocaleTimeString()}`;
  timeAndDateContainer.append(date);
  if (response === "reply") {
    priorityAndStatus.remove();
  }

  return singleContainer;
}
//  listing the function
let ticketCol = document.querySelector(".tickets-list");

ticketCol.append(listTicket(raiser, ticketPre));

ticketCol.append(listTicket(profiles, ticketPre, "reply"));

const listComments = (commentObj) => {
  const commentDiv = document.createElement("div");
  commentDiv.classList.add(`${commentObj["commentId"]}`, "comment");
  commentDiv.className = "comment";
  commentDiv.setAttribute("id", commentObj["commentId"]);
  //   console.log(commentDiv);
  commentDiv.innerHTML = `
      <span class="comment-name-pic">
        <img src=${commentObj.profileLink} class="profile-logo profile" />
        <div class='comment-name'>${commentObj.name}</div>
      </span>
      <div class="comment-desc">${commentObj.commentDesc}</div>
      <div class="option-container">
        <img id="del-icon" class="del-icon" style="margin-right:1rem;" src="../../assets/images/delete_FILL0_wght400_GRAD0_opsz48.svg" />
        <img class="edit-icon del-icon" id="edit-icon" src="../../assets/images/edit_FILL0_wght400_GRAD0_opsz48.svg" />
      </div>
    `;

  const deleteIcon = commentDiv.querySelector("#del-icon");
  const editIcon = commentDiv.querySelector("#edit-icon");

  console.log(deleteIcon, editIcon);

  deleteIcon.addEventListener("click", () => {
    deleteComment(commentDiv);
    let index = commentData.indexOf(commentObj);
    commentData.splice(index, 1);
    localStorage.setItem("comment", JSON.stringify(commentData));
  });

  editIcon.addEventListener("click", () => {
    editComment(commentDiv, commentObj);
  });

  return commentDiv;
};

// console.log(commentData);
let comments;
if (commentData !== null) {
  comments = commentData.filter((e) => e["ticketId"] === ticketId);
  comments.forEach((e) => {
    document.getElementById("comments-list").appendChild(listComments(e));
  });
}

const delIcon = document.querySelector(".del-icon");

// console.log(comments);

let button = document.querySelector(".log-btn");

const deleteComment = (comment) => {
  let parentElm = document.querySelector("#comments-list");
  if (window.confirm("Are you sure to delete the comment ?")) {
    comment.remove();
  }
};

const editComment = (comment, commentObj) => {
  let parentElm = document.querySelector("#comments-list");
  let edited = window.prompt("Do you want to edit comment ?");
  comment.querySelector(".comment-desc").innerText = edited;
  let index = commentData.indexOf(comment);
  commentObj["commentDesc"] = edited;
  commentData[index] = commentObj;
  localStorage.setItem("comment", JSON.stringify(commentData));
};

button.addEventListener("click", (e) => {
  e.preventDefault();
  let commentInput = document.querySelector(".comment-input");
  let name = profiles["name"];

  let arr = [];
  let comment = new Object();

  comment["name"] = name;
  comment["commentDesc"] = commentInput.value;
  comment["ticketId"] = ticketId;
  comment["commentId"] = Date.now();
  comment["profileLink"] = profiles["profileLink"];

  if (commentData === null) {
    arr.push(comment);
    localStorage.setItem("comment", JSON.stringify(arr));
  } else {
    commentData.push(comment);
    localStorage.setItem("comment", JSON.stringify(commentData));
  } // Create new comment element

  document.getElementById("comments-list").appendChild(listComments(comment));

  // Reset input values
  commentInput.value = "";
});
