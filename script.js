const envelope = document.querySelector("#envelope");
const invitation = document.querySelector("#invitation");
const seal = document.querySelector("#seal");
const musicToggle =
  document.getElementById("music-toggle");

if (envelope && invitation && seal) {

  seal.addEventListener("click", () => {

    envelope.classList.add("is-open");
    invitation.classList.add("visible");
    musicToggle?.classList.add("is-visible");

    setTimeout(() => {
  envelope.style.display = "none";}, 1000);

  });

}

/* =========================
   MUSIC
   ========================= */

const weddingMusic =
  document.getElementById("wedding-music");

const musicIcon =
  document.getElementById("music-icon");


musicToggle?.addEventListener("click", async () => {

  if (!weddingMusic) return;


  /* MUSIC IS CURRENTLY OFF */

  if (weddingMusic.paused) {

    try {

      await weddingMusic.play();

      musicIcon.src =
        "Assets/music-on-green.svg";

        musicToggle.classList.add("is-playing");

      musicToggle.setAttribute(
        "aria-label",
        "Pausar música"
      );

      musicToggle.setAttribute(
        "aria-pressed",
        "true"
      );

    } catch (error) {

      console.error(
        "Music could not be played:",
        error
      );

    }


  /* MUSIC IS CURRENTLY ON */

  } else {

    weddingMusic.pause();

    musicIcon.src =
      "Assets/music-off-green.svg";

      musicToggle.classList.remove("is-playing");

    musicToggle.setAttribute(
      "aria-label",
      "Reproducir música"
    );

    musicToggle.setAttribute(
      "aria-pressed",
      "false"
    );

  }

});

/* =========================
   COUNTDOWN
   ========================= */

const weddingDate = new Date("2026-11-28T00:00:00");

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const countdownMessage = document.getElementById("countdown-message");

function formatNumber(number, minimumLength = 2) {
  return String(number).padStart(minimumLength, "0");
}

function updateCountdown() {
  const currentDate = new Date();
  const remainingTime = weddingDate.getTime() - currentDate.getTime();

  if (remainingTime <= 0) {
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";

    if (countdownMessage) {
      countdownMessage.textContent = "¡Hoy es el gran día!";
    }

    return;
  }

  const totalSeconds = Math.floor(remainingTime / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysElement.textContent = formatNumber(days, 2);
  hoursElement.textContent = formatNumber(hours);
  minutesElement.textContent = formatNumber(minutes);
  secondsElement.textContent = formatNumber(seconds);
}

if (
  daysElement &&
  hoursElement &&
  minutesElement &&
  secondsElement
) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}


/* =========================
   RSVP
   ========================= */

const rsvpChoices = document.querySelectorAll(".rsvp-choice");

const seatCountElement =
  document.getElementById("seat-count");

const attendingCountWrap =
  document.getElementById("attending-count-wrap");

const attendingCountSelect =
  document.getElementById("attending-count");


/* TEST DATA
   Later this comes from Google Sheets
*/

const invitedSeats = Number(
  seatCountElement?.textContent.trim() || 1
);


/* BUILD ATTENDING OPTIONS */

function buildAttendingOptions(maxSeats) {

  if (!attendingCountSelect) return;

  attendingCountSelect.innerHTML = "";

  for (let number = 1; number <= maxSeats; number++) {

    const option = document.createElement("option");

    option.value = number;
    option.textContent = number;

    attendingCountSelect.appendChild(option);

  }

  /* Default to everyone attending */

  attendingCountSelect.value = maxSeats;
}

buildAttendingOptions(invitedSeats);


/* YES / NO BUTTONS */

rsvpChoices.forEach((button) => {

  button.addEventListener("click", () => {

    rsvpChoices.forEach((choice) => {
      choice.classList.remove("is-selected");
    });

    button.classList.add("is-selected");

    const response = button.dataset.response;


    /* YES */

    if (response === "yes") {

      attendingCountWrap?.classList.add("is-visible");

      if (attendingCountSelect) {
        attendingCountSelect.value = invitedSeats;
      }

    }


    /* NO */

    if (response === "no") {

      attendingCountWrap?.classList.remove("is-visible");

      if (attendingCountSelect) {
        attendingCountSelect.value = "";
      }

    }


    console.log("RSVP response:", response);

  });

});


/* ATTENDING COUNT TEST */

attendingCountSelect?.addEventListener("change", () => {

  console.log(
    "People attending:",
    attendingCountSelect.value
  );

});