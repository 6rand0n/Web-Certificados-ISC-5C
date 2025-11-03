document.addEventListener("DOMContentLoaded", () => {
  checkSession();

  const modal = document.getElementById("loginModal");

  // Mostrar el "mini modal" debajo del botón
  document.getElementById("loginBtn").onclick = (e) => {
    e.stopPropagation(); // evita cierre inmediato
    modal.style.display = modal.style.display === "flex" ? "none" : "flex";
  };

  // Cerrar con el botón X
  document.getElementById("closeModal").onclick = () => {
    modal.style.display = "none";
  };

  // Cerrar si se hace clic fuera
  window.addEventListener("click", (e) => {
    if (!modal.contains(e.target) && e.target.id !== "loginBtn") {
      modal.style.display = "none";
    }
  });

  // Logout
  document.getElementById("logoutBtn").onclick = logout;

  // Enviar formulario login
  const form = document.getElementById("formLogin");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cuenta = document.getElementById("login").value;
    const contrasena = document.getElementById("password").value;

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cuenta, contrasena })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.usuario.nombre);
        updateUILoggedIn(data.usuario.nombre);
        Swal.fire({
          icon: "success",
          title: "Acceso permitido",
          text: `Bienvenido, ${cuenta}`,
          confirmButtonColor: "#1e3d58",
        });
        document.getElementById("loginModal").style.display = "none";
      } else {
      // Respuesta de error: mostrar mensaje si viene en el body
      Swal.fire({
        icon: "error",
        title: "Error en el inicio de sesión",
        text: data?.error ?? `Error ${res.status}: ${res.statusText}`,
        confirmButtonColor: "#d33"
      });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error en la conexion con el servidor.",
        text: data?.error ?? `Error ${res.status}: ${res.statusText}`,
        confirmButtonColor: "#d33"
      });
    }

    // Limpiar campos
    document.getElementById("login").value = "";
    document.getElementById("password").value = "";
  });
});

// --- Comprobación de sesión al cargar ---
function checkSession() {
  const user = localStorage.getItem("userName");
  if (user) updateUILoggedIn(user);
  else updateUILoggedOut();
}

// --- Actualizar UI cuando hay sesión ---
function updateUILoggedIn(userName) {
  document.getElementById("userName").textContent = userName;
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("logoutBtn").style.display = "inline-block";
}

// --- Actualizar UI cuando no hay sesión ---
function updateUILoggedOut() {
  document.getElementById("userName").textContent = "";
  document.getElementById("loginBtn").style.display = "inline-block";
  document.getElementById("logoutBtn").style.display = "none";
}

// --- Cerrar sesión ---
async function logout() {
  try {
    const res = await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (res.ok){
        Swal.fire({
          icon: "success",
          title: "Sesion cerrada correctamente!",
          confirmButtonColor: "#1e3d58"
        });
    }
    else{
      Swal.fire({
        icon: "error",
        title: "Error al cerrar sesión",
        confirmButtonColor: "#d33"
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor. Inténtalo más tarde.",
      confirmButtonColor: "#d33"
    });
  }

  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  updateUILoggedOut();
}
