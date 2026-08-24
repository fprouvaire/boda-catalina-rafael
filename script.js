const RSVP_API_URL =
  "https://script.google.com/macros/s/AKfycbyvpehhzPyYmJACKT5K2vMUxAb72qtQYnGpKLEKZkFKAcqWpw1JSFnn0dYZCLvlZsXltg/exec";
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

const rsvpChoices =
  document.querySelectorAll(".rsvp-choice");

const guestNameElement =
  document.getElementById("guest-name");

const seatCountElement =
  document.getElementById("seat-count");

const attendingCountWrap =
  document.getElementById("attending-count-wrap");

const attendingCountSelect =
  document.getElementById("attending-count");

const rsvpSubmit =
  document.getElementById("rsvp-submit");

const rsvpStatus =
  document.getElementById("rsvp-status");


/* =========================
   READ GUEST ID FROM URL
   ========================= */

const urlParams =
  new URLSearchParams(window.location.search);

const guestId =
  urlParams.get("id");


/* CURRENT RSVP STATE */

let invitedSeats = 1;
let selectedRsvp = null;


/* =========================
   BUILD ATTENDING OPTIONS
   ========================= */

function buildAttendingOptions(maxSeats) {

  if (!attendingCountSelect) return;

  attendingCountSelect.innerHTML = "";

  for (
    let number = 1;
    number <= maxSeats;
    number++
  ) {

    const option =
      document.createElement("option");

    option.value = number;
    option.textContent = number;

    attendingCountSelect.appendChild(option);

  }

  /* Default to all invited guests */

  attendingCountSelect.value =
    String(maxSeats);
}


/* =========================
   LOAD GUEST FROM GOOGLE SHEETS
   ========================= */

async function loadGuestData() {

  if (!guestId) {

    console.warn(
      "No guest ID was found in the URL."
    );

    return;
  }

  try {

    const response = await fetch(
      `${RSVP_API_URL}?id=${encodeURIComponent(guestId)}`
    );

    const data =
      await response.json();


    if (!data.success) {

      console.error(
        "Guest lookup failed:",
        data.error
      );

      return;
    }


    /* GUEST NAME */

    if (guestNameElement) {
      guestNameElement.textContent =
        data.guest;
    }


    /* INVITED SEATS */

    invitedSeats =
      Number(data.seats) || 1;

    if (seatCountElement) {
      seatCountElement.textContent =
        invitedSeats;
    }


    /* BUILD SELECT */

    buildAttendingOptions(
      invitedSeats
    );


    /* =========================
       LOAD PREVIOUS RSVP
       ========================= */

    if (data.rsvp === "Sí") {

      selectedRsvp = "yes";

      const yesButton =
        document.querySelector(
          '.rsvp-choice[data-response="yes"]'
        );

      yesButton?.classList.add(
        "is-selected"
      );

      attendingCountWrap?.classList.add(
        "is-visible"
      );

      if (
        attendingCountSelect &&
        data.attending
      ) {
        attendingCountSelect.value =
          String(data.attending);
      }

      if (rsvpSubmit) {
        rsvpSubmit.disabled = false;
        rsvpSubmit.textContent =
          "Actualizar";
      }

    }


    if (data.rsvp === "No") {

      selectedRsvp = "no";

      const noButton =
        document.querySelector(
          '.rsvp-choice[data-response="no"]'
        );

      noButton?.classList.add(
        "is-selected"
      );

      attendingCountWrap?.classList.remove(
        "is-visible"
      );

      if (rsvpSubmit) {
        rsvpSubmit.disabled = false;
        rsvpSubmit.textContent =
          "Actualizar";
      }

    }


    console.log(
      "Guest loaded:",
      data
    );

  } catch (error) {

    console.error(
      "Could not load guest data:",
      error
    );

  }

}


/* =========================
   YES / NO BUTTONS
   ========================= */

rsvpChoices.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      rsvpChoices.forEach(
        (choice) => {
          choice.classList.remove(
            "is-selected"
          );
        }
      );

      button.classList.add(
        "is-selected"
      );

      selectedRsvp =
        button.dataset.response;


      /* ENABLE CONFIRM BUTTON */

      if (rsvpSubmit) {
        rsvpSubmit.disabled = false;
      }


      /* CLEAR OLD STATUS MESSAGE */

      if (rsvpStatus) {
        rsvpStatus.textContent = "";
      }


      /* YES */

      if (
        selectedRsvp === "yes"
      ) {

        attendingCountWrap
          ?.classList.add(
            "is-visible"
          );

        if (
          attendingCountSelect &&
          !attendingCountSelect.value
        ) {

          attendingCountSelect.value =
            String(invitedSeats);

        }

      }


      /* NO */

      if (
        selectedRsvp === "no"
      ) {

        attendingCountWrap
          ?.classList.remove(
            "is-visible"
          );

        if (
          attendingCountSelect
        ) {
          attendingCountSelect.value =
            "";
        }

      }


      console.log(
        "RSVP response:",
        selectedRsvp
      );

    }
  );

});


/* =========================
   ATTENDING COUNT
   ========================= */

attendingCountSelect
  ?.addEventListener(
    "change",
    () => {

      console.log(
        "People attending:",
        attendingCountSelect.value
      );

      if (rsvpStatus) {
        rsvpStatus.textContent = "";
      }

    }
  );

/* =========================
   SAVE RSVP
   ========================= */

rsvpSubmit?.addEventListener("click", async () => {

  if (!guestId || !selectedRsvp) {
    return;
  }


  let attending = 0;


  /* YES — VALIDATE ATTENDING COUNT */

  if (selectedRsvp === "yes") {

    attending =
      Number(attendingCountSelect?.value);

    if (
      !Number.isInteger(attending) ||
      attending < 1 ||
      attending > invitedSeats
    ) {

      if (rsvpStatus) {
        rsvpStatus.textContent =
          "Por favor, selecciona cuántas personas asistirán.";
      }

      return;
    }

  }


  /* SAVING STATE */

  rsvpSubmit.disabled = true;
  rsvpSubmit.textContent = "Guardando...";

  if (rsvpStatus) {
    rsvpStatus.textContent = "";
  }


  try {

    const saveUrl =
      `${RSVP_API_URL}` +
      `?action=save` +
      `&id=${encodeURIComponent(guestId)}` +
      `&rsvp=${encodeURIComponent(selectedRsvp)}` +
      `&attending=${encodeURIComponent(attending)}` +
      `&t=${Date.now()}`;


    const response =
      await fetch(saveUrl);


    const data =
      await response.json();


    if (!data.success) {

      throw new Error(
        data.error || "Could not save RSVP"
      );

    }


    /* SUCCESS */

    rsvpSubmit.textContent =
      "Actualizar";

    if (rsvpStatus) {
      rsvpStatus.textContent =
        "¡Gracias! Hemos recibido tu confirmación.";
    }


  } catch (error) {

    console.error(
      "Could not save RSVP:",
      error
    );

    rsvpSubmit.textContent =
      "Confirmar";

    if (rsvpStatus) {
      rsvpStatus.textContent =
        "No pudimos guardar tu respuesta. Por favor, inténtalo nuevamente.";
    }


  } finally {

    rsvpSubmit.disabled = false;

  }

});
/* =========================
   LOAD GUEST
   ========================= */

loadGuestData();