function filterEmails(searchTerm) {
  const memberCards = document.querySelectorAll(".user-info");

  for (let i = 0; i < memberCards.length; i++) {
    const email = memberCards[i]
      .querySelector(".profile-name")
      .querySelector(".member-name")
      .querySelector(".member-email")
      .innerText.toLowerCase();
    console.log(email, meme);
    if (email.includes(searchTerm)) {
      memberCards[i].classList.remove("hidden");
    } else {
      memberCards[i].classList.add("hidden");
    }
  }
}
