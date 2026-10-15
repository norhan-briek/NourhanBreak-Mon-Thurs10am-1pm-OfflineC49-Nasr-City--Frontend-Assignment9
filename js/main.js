var inputName = document.getElementById("name");
var inputNumber = document.getElementById("phonenumber");
var inputEmail = document.getElementById("email");
var inputAddress = document.getElementById("address");
var inputGroup = document.getElementById("group");
var notesInput = document.getElementById("notes");
var isFavoriteInput = document.getElementById("isFavorite");
var isEmergencyInput = document.getElementById("isEmergency");
var contactForm = document.getElementById("contactForm");
var alertInput = document.querySelector("#nameAlert");
var contactslist = document.getElementById("contactsList");
var totalCount = document.getElementById("totalCount");
var favCount = document.getElementById("favCount");
var favoriteList = document.getElementById("favoritesList");
var emergencyCount = document.getElementById("emergencyCount");
var favSidebarText = document.getElementById("favSidebarText");
var emergencyList = document.getElementById("emergencyList");
var emergencySidebarText = document.getElementById("emergencySidebarText");
var emptyState = document.getElementById("emptyState");
var searchInput = document.getElementById("searchInput");
var mood = "create";
var tmp;

var contacts = JSON.parse(localStorage.getItem("contacts")) || [];

var addContactBtn = document.getElementById("addContactBtn");
var addContactModal = document.getElementById("addContactModal");

addContactBtn.addEventListener("click", function () {

    mood = "create";
    contactForm.reset();

  var modal = bootstrap.Modal.getOrCreateInstance(addContactModal);


  modal.show();
});

var regex = {
  name: /^[A-Za-z\u0621-\u064A][A-Za-z\u0621-\u064A ]{2,29}$/i,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
  address: /^[A-Za-z0-9\u0621-\u064A\s,.\-\/]{5,100}$/i,
  phonenumber: /^01[0125][0-9]{8}$/i,
  notes: /^[A-Za-z0-9\u0621-\u064A\s.,!?'"()\-]{0,200}$/i,
};

function validateInput(input, regex) {
  if (input.value.trim() === "") {
    if (input.id === "name" || input.id === "phonenumber") {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      return false;
    } else {
      input.classList.remove("is-invalid");
      input.classList.remove("is-valid");
      return true;
    }
  }

  if (regex.test(input.value)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    return false;
  }
}

inputName.addEventListener("blur", function () {
  validateInput(inputName, regex.name);
});
inputEmail.addEventListener("blur", function () {
  validateInput(inputEmail, regex.email);
});
inputNumber.addEventListener("blur", function () {
  validateInput(inputNumber, regex.phonenumber);
});

// submit function

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (
    !validateInput(inputName, regex.name) ||
    !validateInput(inputNumber, regex.phonenumber) ||
    !validateInput(inputEmail, regex.email) ||
    !validateInput(inputAddress, regex.address) ||
    !validateInput(notesInput, regex.notes)
  ) {
    return;
  }

  // create contact

  var contact = {
    name: inputName.value,
    phonenumber: inputNumber.value,
    email: inputEmail.value,
    address: inputAddress.value,
    group: inputGroup.value,
    notes: notesInput.value,
    isFavorite: isFavoriteInput.checked,
    isEmergency: isEmergencyInput.checked,
  };
  if (mood === "create") {
    contacts.push(contact);
    Swal.fire({
      title: "add",
      text: "Contact has been added successfully",
      icon: "success",
    }).then(function () {
      bootstrap.Modal.getOrCreateInstance(addContactModal).hide();
    });
  } else {
    contacts[tmp] = contact;

    Swal.fire({
      title: "updated",
      text: "Contact has been updated",
      icon: "success",
    }).then(function () {
      bootstrap.Modal.getOrCreateInstance(addContactModal).hide();
    });
  }

  localStorage.setItem("contacts", JSON.stringify(contacts));
  displayContacts(contacts);
  contactForm.reset();
  mood = "create";
});

// display contacts

function displayContacts(list) {
  contactslist.innerHTML = "";
  favoriteList.innerHTML = "";
  emergencyList.innerHTML = "";

  var favCounter = 0;
  var emergencyCounter = 0;

  for (var i = 0; i < list.length; i++) {
    contactslist.innerHTML += `
    <div class="col-12 col-md-6">
      <div class="contact-card h-100">
        <div class="contact-card-body">
          <div class="d-flex align-items-start gap-3 mb-3">
            <div class="avatar-wrap">
              <div class="contact-avatar">${list[i].name.charAt(0).toUpperCase()}</div>
              ${list[i].isFavorite ? '<span class="avatar-star"><i class="fa-solid fa-star"></i></span>' : ""}
            </div>
            <div>
              <h5 class="contact-name mb-1">${list[i].name}</h5>
              <div class="contact-info"><span class="info-icon info-phone"><i class="fa-solid fa-phone"></i></span>${list[i].phonenumber}</div>
            </div>
          </div>
          ${list[i].email ? `<div class="contact-info"><span class="info-icon info-mail"><i class="fa-solid fa-envelope"></i></span>${list[i].email}</div>` : ""}
          ${list[i].group ? `<span class="group-badge">${list[i].group}</span>` : ""}
        </div>

        <div class="contact-card-footer">
          <div class="d-flex gap-2">
            <a href="tel:${list[i].phonenumber}" class="action-btn call-btn" aria-label="Call contact"><i class="fa-solid fa-phone"></i></a>
            ${list[i].email ? `<a href="mailto:${list[i].email}" class="action-btn mail-btn" aria-label="Email contact"><i class="fa-solid fa-envelope"></i></a>` : ""}
          </div>
          <div class="d-flex gap-2">
            <button type="button" class="action-btn favorite-btn ${list[i].isFavorite ? "active-fav" : ""}" data-index="${contacts.indexOf(list[i])}">
              <i class="${list[i].isFavorite ? "fa-solid" : "fa-regular"} fa-star"></i>
            </button>
            <button type="button" class="action-btn emergency-btn ${list[i].isEmergency ? "active-emg" : ""}" data-index="${contacts.indexOf(list[i])}">
              <i class="${list[i].isEmergency ? "fa-solid" : "fa-regular"} fa-heart"></i>
            </button>
            <button type="button" class="action-btn edit-btn" data-index="${contacts.indexOf(list[i])}">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button type="button" class="action-btn delete-btn" data-index="${contacts.indexOf(list[i])}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>`;

    if (list[i].isFavorite === true) {
      favCounter++;

      favoriteList.innerHTML += `
      <div class="side-contact">
        <div class="side-avatar">${list[i].name.charAt(0).toUpperCase()}</div>
        <div class="side-info">
          <div class="side-name">${list[i].name}</div>
          <div class="side-phone">${list[i].phonenumber}</div>
        </div>
        <a href="tel:${list[i].phonenumber}" class="action-btn call-btn" aria-label="Call contact"><i class="fa-solid fa-phone"></i></a>
      </div>`;
    }

    if (list[i].isEmergency === true) {
      emergencyCounter++;

      emergencyList.innerHTML += `
      <div class="side-contact">
        <div class="side-avatar emergency">${list[i].name.charAt(0).toUpperCase()}</div>
        <div class="side-info">
          <div class="side-name">${list[i].name}</div>
          <div class="side-phone">${list[i].phonenumber}</div>
        </div>
        <a href="tel:${list[i].phonenumber}" class="action-btn call-btn" aria-label="Call contact"><i class="fa-solid fa-phone"></i></a>
      </div>`;
    }
  }

  var btn = document.querySelectorAll(".delete-btn");

  for (var j = 0; j < btn.length; j++) {
    btn[j].addEventListener("click", function (e) {
      var index = e.currentTarget.getAttribute("data-index");

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      }).then(function (result) {
        if (result.isConfirmed === true) {
          contacts.splice(index, 1);
          localStorage.setItem("contacts", JSON.stringify(contacts));
          displayContacts(contacts);
        }
      });
    });
  }

  var btnEdit = document.querySelectorAll(".edit-btn");

  for (var k = 0; k < btnEdit.length; k++) {
    btnEdit[k].addEventListener("click", function (e) {
      var index = e.currentTarget.getAttribute("data-index");
      inputName.value = contacts[index].name;
      inputAddress.value = contacts[index].address;
      inputEmail.value = contacts[index].email;
      inputNumber.value = contacts[index].phonenumber;
      notesInput.value = contacts[index].notes;
      inputGroup.value = contacts[index].group;
      isFavoriteInput.checked = contacts[index].isFavorite;
      isEmergencyInput.checked = contacts[index].isEmergency;
      mood = "update";
      tmp = index;
      var modal = bootstrap.Modal.getOrCreateInstance(addContactModal);
      modal.show();
    });
  }

  var btnFavorite = document.querySelectorAll(".favorite-btn");
  for (var n = 0; n < btnFavorite.length; n++) {
    btnFavorite[n].addEventListener("click", function (e) {
      var index = e.currentTarget.getAttribute("data-index");
      contacts[index].isFavorite = !contacts[index].isFavorite;
      localStorage.setItem("contacts", JSON.stringify(contacts));
      displayContacts(contacts);
    });
  }
  var btnEmergency = document.querySelectorAll(".emergency-btn");
  for (var m = 0; m < btnEmergency.length; m++) {
    btnEmergency[m].addEventListener("click", function (e) {
      var index = e.currentTarget.getAttribute("data-index");
      contacts[index].isEmergency = !contacts[index].isEmergency;
      localStorage.setItem("contacts", JSON.stringify(contacts));
      displayContacts(contacts);
    });
  }

  if (list.length === 0) {
    emptyState.classList.remove("d-none");
  } else {
    emptyState.classList.add("d-none");
  }

  if (favCounter > 0) {
    favSidebarText.classList.add("d-none");
  } else {
    favSidebarText.classList.remove("d-none");
  }
  if (emergencyCounter > 0) {
    emergencySidebarText.classList.add("d-none");
  } else {
    emergencySidebarText.classList.remove("d-none");
  }

  totalCount.textContent = contacts.length;

  document.getElementById("contactCountLabel").textContent = contacts.length;

  favCount.textContent = favCounter;

  emergencyCount.textContent = emergencyCounter;
}

displayContacts(contacts);

searchInput.addEventListener("input", function (e) {
  var searchValue = e.target.value.toLowerCase();

  var filteredContacts = contacts.filter(function (contact) {
    return (
      contact.name.toLowerCase().startsWith(searchValue) ||
      contact.phonenumber.includes(searchValue) ||
      contact.email.toLowerCase().includes(searchValue)
    );
  });
  displayContacts(filteredContacts);
});