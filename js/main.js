const API = "http://localhost:8000/contacts";
let searchValue = "";
//! Create
let inpName = $(".inp-name");
let inpSurname = $(".inp-surname");
let inpPhone = $(".inp-phone");
let addForm = $(".add-form");
let addModal = $(".modal");
let btnNewContact = $(".newContact");
let contactList = $("tbody");

addForm.on("submit", async (event) => {
  event.preventDefault();
  //! помещаю данные полученные с инпутов в новые переменные
  let name = inpName.val().trim();
  let surname = inpSurname.val().trim();
  let phoneNumber = parseInt(inpPhone.val().trim());

  //  ! Создаю объект для отправки в БД
  let newContact = {
    name: name,
    surname: surname,
    phone: phoneNumber,
  };

  for (let k in newContact) {
    if (!newContact[k]) {
      alert("Заполните все поля");
      return;
    }
  }

  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newContact),
  });
  inpName.val("");
  inpSurname.val("");
  inpPhone.val("");
  addModal.modal("hide");
  getContacts();
});

//! Read
async function getContacts() {
  const response = await fetch(`${API}?q=${searchValue}`);
  const data = await response.json();

  let first = currentPage * postsPerPage - postsPerPage;
  let last = currentPage * postsPerPage;
  const currentContacts = data.slice(first, last);
  lastPage = Math.ceil(data.length / postsPerPage);

  if (currentPage === 1) {
    prevBtn.addClass("disabled");
  } else {
    prevBtn.removeClass("disabled");
  }

  if (lastPage === currentPage) {
    nextBtn.addClass("disabled");
  } else {
    nextBtn.removeClass("disabled");
  }
  contactList.html("");
  currentContacts.forEach((item) => {
    contactList.append(`
        <tr>
        <td>${item.name}</td>
        <td>${item.surname}</td>
        <td>${item.phone}</td>
        <td><button class="btn-delete" id="${item.id}">
        <img src="https://cdn-icons.flaticon.com/png/512/3132/premium/3132919.png?token=exp=1648128711~hmac=22ccb6aa20aacb9917b0b610c88d6c10">
      </button>
      <button id="${item.id}" class="btn-edit" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
      <img src="https://cdn-icons-png.flaticon.com/512/1827/1827951.png">
      </button></td>
        </tr>
        
        
`);
  });
}
getContacts();

// ! Delete

$(document).on("click", ".btn-delete", async (event) => {
  let id = event.currentTarget.id;
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  getContacts();
});

// ! Update
let editName = $(".edit-name");
let editSurname = $(".edit-surname");
let editPhone = $(".edit-phone");
let editForm = $(".edit-form");
let editModal = $(".fade");

$(document).on("click", ".btn-edit", async (event) => {
  let id = event.currentTarget.id;
  editForm.attr("id", id);
  const response = await fetch(`${API}/${id}`);
  const data = await response.json();
  editName.val(data.name);
  editSurname.val(data.surname);
  editPhone.val(data.phone);
});

editForm.on("submit", async (event) => {
  event.preventDefault();
  let name = editName.val().trim();
  let surname = editSurname.val().trim();
  let phoneNumber = parseInt(editPhone.val().trim());

  let editedContacts = {
    name: name,
    surname: surname,
    phone: phoneNumber,
  };
  let id = event.currentTarget.id;
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedContacts),
  });
  getContacts();
  editModal.modal("hide");
});

let prevBtn = $(".prev-btn");
let nextBtn = $(".next-btn");
let postsPerPage = 5; //! Количество отображаемых элементов на одной странице
let currentPage = 1;
let lastPage = 1;

nextBtn.on("click", () => {
  if (lastPage === currentPage) {
    return;
  }
  currentPage++;
  getContacts();
  window.scrollTo(0, 0);
});

prevBtn.on("click", () => {
  if (currentPage === 1) {
    return;
  }
  currentPage--;
  getContacts();
  window.scrollTo(0, 0);
});

let searchInp = $(".inp-search");
let searchBtn = $(".btnFind");
searchInp.on("input", (event) => {
  searchValue = event.target.value;
  currentPage = 1;
  getContacts(searchValue);
});

// searchBtn.on("click", () => {
//   getContacts(searchValue);
// });
