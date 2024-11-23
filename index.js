/* == UI - Elements == */

const viewLoggedOut = document.getElementById("logged-out-view");
const viewLoggedIn = document.getElementById("logged-in-view");

const authFields = document.getElementById("auth-fields-and-buttons");

const signInWithGoogleButtonEl = document.getElementById(
  "sign-in-with-google-btn"
);

const emailInputEl = document.getElementById("email-input");
const passwordInputEl = document.getElementById("password-input");

const signInButtonEl = document.getElementById("sign-in-btn");
const createAccountButtonEl = document.getElementById("create-account-btn");

const signOutButtonEl = document.getElementById("sign-out-btn");

const userProfilePictureEl = document.getElementById("user-profile-picture");
const userGreetingEl = document.getElementById("user-greeting");

const moodEmojiEls = document.getElementsByClassName("mood-emoji-btn");
const textareaEl = document.getElementById("post-input");
const postButtonEl = document.getElementById("post-btn");

const postsEl = document.getElementById("posts");

const email = "cesar@gmail.com"; // email para iniciar sesion
const password = "123456"; // contraseña para iniciar sesion
const user = {
  // objeto que guarda los datos del usuario para cuando haya iniciado sesion
  displayName: "",
  photoURL: "assets/images/kitten.jpg",
};

/* == UI - Event Listeners == */

for (let moodEmojiEl of moodEmojiEls) {
  moodEmojiEl.addEventListener("click", selectMood);
}

postButtonEl.addEventListener("click", postButtonPressed);

signInButtonEl.addEventListener("click", login);

signOutButtonEl.addEventListener("click", logout);

/* === State === */

let moodState = 0;
let posts = []; // aqui se van a guardar los posts que hagas -> se declara como let para poder cambiar su valor

/* === Global Constants === */

const collectionName = "posts";

/* === Main Code === */

/** Evento que se ejecuta cuando se carga el HTML y el documento está listo **/
document.addEventListener("DOMContentLoaded", () => {
  console.log("Iniciando");
  showLoggedOutView(); // muestra la pantalla para iniciar sesion cuando se carga el documento
  // showLoggedInView(); // -> esto es lo que estaba antes en el codigo y hacia que se mostrara la otra pantalla
});

/* === Functions === */

/* = Functions - Firebase - Authentication = */

/**
 * funcion para iniciar sesion
 */
function login() {
  /* Validacion en caso de que no se ingrese un correo o contraseña */
  if (emailInputEl.value.trim() === "" || passwordInputEl.value.trim() === "") {
    showError("Ingresar un email o password validos"); // Muestra un error en caso de existir
    return; // Detiene la ejecucion del codigo en caso de error
  }

  /* Validacion en caso de que el correo o la contraseña sean incorrectos */
  if (
    emailInputEl.value.trim() !== email ||
    passwordInputEl.value.trim() !== password
  ) {
    showError("Correo o contraseña incorrectos"); // Muestra un error en caso de existir
    return; // Detiene la ejecucion del codigo en caso de error
  }

  generateUserName(email); // Funcion para crear un nombre de usuario en base al correo
  showLoggedInView(); // Si los datos son correctos, muestra la otra vista de la pagina
  showProfilePicture(userProfilePictureEl, user); // Esta funcion no se estaba llamando -> Sirve para agregar la foto de perfil
  clearAuthFields(); // Limpia los datos del formulario de login
}

/* = Functions - Firebase - Cloud Firestore = */

/* Funcion para cerrar sesion */
function logout() {
  resetAllMoodElements(moodEmojiEls); // Limpia los emojis seleccionados en caso de existir
  showLoggedOutView(); // Muestra la otra pantalla
}

/* Funcion para generar un nombre de usuario en base al correo electronico */
function generateUserName(email) {
  // Dividir el correo en dos partes usando el símbolo '@' y retornar la primera parte
  const userName = email.split("@")[0];
  user.displayName = userName; // Agregamos el numbre de usuario al objeto de usuario
}

/* == Functions - UI Functions == */

/* Funcion para mostrar un error en caso de existir */
function showError(msg) {
  const p = document.createElement("p"); // Creamos un contenedor para el error
  p.innerText = msg; // Agregamos un texto dinamico al error

  authFields.appendChild(p); // Agregamos el parrafo con el error

  setInterval(() => {
    authFields.removeChild(p);
  }, 3000); // Luego de 3 segundos, el error desaparece
}

/* Funcion para mostrar los posts en pantalla */
function renderPost(postsEl, postData) {
  postsEl.innerHTML += `
        <div class="post">
            <div class="header">
                <h3>${postData.createdAt}</h3>
                <img src="assets/emojis/${postData.mood}.png">
            </div>
            <div class="header">
              <p>
                ${replaceNewlinesWithBrTags(postData.body)}
              </p>
              <div class="delete" onclick="deletePost('${postData.id}')">x</div>
            </div>
        </div>
    `;
}

/* Funcion para eliminar un post tomando su id unico */
function deletePost(id) {
  // Filtrar los posts para eliminar el seleccionado
  posts = posts.filter(post => post.id !== id);

  // Limpiar la vista actual de los posts
  clearAll(postsEl);

  // Volver a renderizar los posts restantes
  posts.forEach(post => renderPost(postsEl, post));
}

function replaceNewlinesWithBrTags(inputString) {
  return inputString.replace(/\n/g, "<br>");
}

function postButtonPressed() {
  const postBody = textareaEl.value;

  if (postBody && moodState) {
    addPostToDB(postBody); // Llamamos la funcion para darle formato a los posts
    clearInputField(textareaEl);
    resetAllMoodElements(moodEmojiEls);
  }
}

function clearAll(element) {
  element.innerHTML = "";
}

function showLoggedOutView() {
  hideView(viewLoggedIn);
  showView(viewLoggedOut);
}

function showLoggedInView() {
  hideView(viewLoggedOut);
  showView(viewLoggedIn);
}

function showView(view) {
  view.style.display = "flex";
}

function hideView(view) {
  view.style.display = "none";
}

function clearInputField(field) {
  field.value = "";
}

function clearAuthFields() {
  clearInputField(emailInputEl);
  clearInputField(passwordInputEl);
}

function showProfilePicture(imgElement, user) {
  const photoURL = user.photoURL;

  if (photoURL || photoURL !== "") {
    // Agregamos una validacion extra en caso de que la foto de perfil venga vacia
    imgElement.src = photoURL;
  } else {
    imgElement.src = "assets/images/default-profile-picture.jpeg";
  }
}

function showUserGreeting(element, user) {
  const displayName = user.displayName;

  if (displayName) {
    const userFirstName = displayName.split(" ")[0];

    element.textContent = `Hey ${userFirstName}, how are you?`;
  } else {
    element.textContent = `Hey friend, how are you?`;
  }
}

/* Funcion para generar la fecha del post -> actualizada con codigo propio porque no le entendi al codigo que ya venia creado xd */
function displayDate(date) {
  // if (!firebaseDate) {
  //   return "Date processing";
  // }

  // const date = firebaseDate.toDate();

  // const day = date.getDate();
  // const year = date.getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // let hours = date.getHours();
  // let minutes = date.getMinutes();
  // hours = hours < 10 ? "0" + hours : hours;
  // minutes = minutes < 10 ? "0" + minutes : minutes;

  const day = String(date.getDate()).padStart(2, "0"); // Día con dos dígitos
  const month = monthNames[date.getMonth()]; // Mes en texto
  const year = String(date.getFullYear()).slice(-2); // Últimos dos dígitos del año
  const hour = String(date.getHours()).padStart(2, "0"); // Hora con dos dígitos
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Minutos con dos dígitos

  return `${day} ${month} ${year} - ${hour}:${minutes}`; // Retornamos la fecha ya creada
}

/* = Functions - UI Functions - Mood = */

function selectMood(event) {
  const selectedMoodEmojiElementId = event.currentTarget.id;

  changeMoodsStyleAfterSelection(selectedMoodEmojiElementId, moodEmojiEls);

  const chosenMoodValue = returnMoodValueFromElementId(
    selectedMoodEmojiElementId
  );

  moodState = chosenMoodValue;
}

function changeMoodsStyleAfterSelection(
  selectedMoodElementId,
  allMoodElements
) {
  for (let moodEmojiEl of moodEmojiEls) {
    if (selectedMoodElementId === moodEmojiEl.id) {
      moodEmojiEl.classList.remove("unselected-emoji");
      moodEmojiEl.classList.add("selected-emoji");
    } else {
      moodEmojiEl.classList.remove("selected-emoji");
      moodEmojiEl.classList.add("unselected-emoji");
    }
  }
}

function resetAllMoodElements(allMoodElements) {
  for (let moodEmojiEl of allMoodElements) {
    moodEmojiEl.classList.remove("selected-emoji");
    moodEmojiEl.classList.remove("unselected-emoji");
  }

  moodState = 0;
}

function returnMoodValueFromElementId(elementId) {
  return Number(elementId.slice(5));
}

/* Funcion para agregar los post al arreglo de posts */
function addPostToDB(postBody) {
  const date = new Date();

  const postData = {
    // Creamos el formato de los posts
    id: Date.now().toString(), // Creamos un id unico para cada post
    createdAt: displayDate(date), // Agregamos la fecha del post
    mood: moodState, // Agregamos el mood seleccionado por el usuario
    body: postBody, // Agregamos el contenido del post
  };

  // Agregar el post al arreglo de posts
  posts.push(postData);

  // Renderizar el post en el HTML
  renderPost(postsEl, postData);
}
