const API_URL = "https://jsonplaceholder.typicode.com/users";
const cardContainer = document.getElementById("cardContainer");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");

let users = [];

fetch(API_URL)
  .then(res => {
    if (!res.ok) throw new Error("Error al cargar los datos");
    return res.json();
  })
  .then(data => {
    users = data;
    renderCards(users);
  })
  .catch(err => {
    cardContainer.innerHTML = `<div class="alert alert-danger text-center">${err.message}</div>`;
  });

function renderCards(data) {
  cardContainer.innerHTML = "";
  resultCount.textContent = data.length;

  data.forEach(user => {
    const card = document.createElement("div");
    card.className = "col-md-6 col-lg-4";
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5>${user.name} <small class="text-muted">(${user.username})</small></h5>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Teléfono:</strong> ${user.phone}</p>
          <p><strong>Dirección:</strong> ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}</p>
          <p><strong>Empresa:</strong> ${user.company.name}</p>
          <a href="http://${user.website}" target="_blank" class="btn btn-sm btn-outline-secondary">Sitio Web</a>
          <button class="btn btn-sm btn-primary mt-2" onclick="openMapModal(${user.id})">Ver Mapa</button>
          <button class="btn btn-sm btn-info mt-2" onclick="openUserModal(${user.id})">Ver Usuario</button>
        </div>
      </div>
    `;
    cardContainer.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = users.filter(user =>
    user.name.toLowerCase().includes(term) ||
    user.username.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term) ||
    user.address.city.toLowerCase().includes(term) ||
    user.company.name.toLowerCase().includes(term)
  );
  renderCards(filtered);
});

function openMapModal(id) {
  const user = users.find(u => u.id === id);
  const { lat, lng } = user.address.geo;

  document.getElementById("mapModalTitle").textContent = `${user.name} - ${user.address.city}`;
  document.getElementById("mapLink").href = `https://www.google.com/maps?q=${lat},${lng}`;

  const modal = new bootstrap.Modal(document.getElementById("mapModal"));
  modal.show();

  setTimeout(() => {
    const map = L.map("map").setView([lat, lng], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    L.marker([lat, lng]).addTo(map);
  }, 300);
}

function openUserModal(id) {
  const user = users.find(u => u.id === id);
  const modalBody = document.getElementById("userModalBody");

  modalBody.innerHTML = `
    <h5>Datos Personales</h5>
    <p><strong>Nombre:</strong> ${user.name}</p>
    <p><strong>Username:</strong> ${user.username}</p>

    <h5>Contacto</h5>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Teléfono:</strong> ${user.phone}</p>
    <p><strong>Website:</strong> <a href="http://${user.website}" target="_blank">${user.website}</a></p>

    <h5>Dirección</h5>
    <p>${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}</p>

    <h5>Empresa</h5>
    <p><strong>Nombre:</strong> ${user.company.name}</p>
    <p><strong>CatchPhrase:</strong> ${user.company.catchPhrase}</p>
    <p><strong>BS:</strong> ${user.company.bs}</p>

    <h5>Geolocalización</h5>
    <p><strong>Latitud:</strong> ${user.address.geo.lat}</p>
    <p><strong>Longitud:</strong> ${user.address.geo.lng}</p>
  `;

  const modal = new bootstrap.Modal(document.getElementById("userModal"));
  modal.show();
}
