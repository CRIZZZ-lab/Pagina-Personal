const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Menú adaptable para celulares
const menuToggle = $("#menuToggle");
const nav = $("#nav");
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  menuToggle.textContent = isOpen ? "×" : "☰";
});
$$(".nav a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
  menuToggle.textContent = "☰";
}));

// Alternar entre tema oscuro y claro
const themeToggle = $("#themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const light = document.body.classList.contains("light-theme");
  themeToggle.textContent = light ? "☀" : "◐";
  themeToggle.setAttribute("aria-label", light ? "Activar tema oscuro" : "Activar tema claro");
});

// Texto animado de profesiones
const roles = ["Ingeniero en sistemas", "Desarrollador web", "Entusiasta de la IA"];
const typedRole = $("#typedRole");
let roleIndex = 0;
let charIndex = roles[0].length;
let deleting = false;
function typeRole() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typedRole.textContent = current.slice(0, charIndex);
    if (charIndex >= current.length) {
      deleting = true;
      setTimeout(typeRole, 1500);
      return;
    }
  } else {
    charIndex--;
    typedRole.textContent = current.slice(0, charIndex);
    if (charIndex <= 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 45 : 85);
}
setTimeout(typeRole, 1700);

// Reloj y año del sistema
function updateClock() {
  const now = new Date();
  const year = now.getFullYear();
  $("#footerYear").textContent = year;
}
updateClock();

// Detalles de proyectos en ventanas emergentes
const projectData = {
  nexus: {
    title: "NEXUS CONTROL",
    eyebrow: "PROJECT 01 // WEB APP",
    description: "Una plataforma conceptual para que pequeños negocios organicen tareas, revisen indicadores y visualicen sus operaciones desde un panel central. En una versión real, podría conectarse a una base de datos y requerir autenticación segura.",
    tags: ["HTML", "CSS", "JAVASCRIPT", "DASHBOARDS"]
  },
  orbit: {
    title: "ORBIT AI",
    eyebrow: "PROJECT 02 // IA",
    description: "Un prototipo imaginado de asistente digital para clasificar información y ayudar a completar tareas repetitivas. La versión de demostración representa la idea; no incluye un modelo de inteligencia artificial real conectado.",
    tags: ["PYTHON", "IA", "AUTOMATIZACIÓN", "PROTOTIPO"]
  },
  shield: {
    title: "CYBER SHIELD",
    eyebrow: "PROJECT 03 // SEGURIDAD",
    description: "Un panel educativo para practicar conceptos básicos de seguridad digital, como crear contraseñas robustas, reconocer riesgos comunes y revisar buenas prácticas de protección de cuentas.",
    tags: ["CIBERSEGURIDAD", "REDES", "EDUCACIÓN"]
  }
};
const projectDialog = $("#projectDialog");
$$(".project-detail").forEach(button => {
  button.addEventListener("click", () => {
    const project = projectData[button.dataset.project];
    $("#dialogEyebrow").textContent = project.eyebrow;
    $("#dialogTitle").textContent = project.title;
    $("#dialogDescription").textContent = project.description;
    const tagBox = $("#dialogTags");
    tagBox.replaceChildren();
    project.tags.forEach(tag => {
      const span = document.createElement("span");
      span.textContent = tag;
      tagBox.appendChild(span);
    });
    projectDialog.showModal();
  });
});
$("#dialogClose").addEventListener("click", () => projectDialog.close());
projectDialog.addEventListener("click", event => {
  if (event.target === projectDialog) projectDialog.close();
});

// Terminal interactiva de demostración
const terminalForm = $("#terminalForm");
const terminalInput = $("#terminalInput");
const terminalOutput = $("#terminalOutput");
const commandHints = $$(".command-hints button");
const terminalCommands = {
  help: [
    "COMANDOS DISPONIBLES:",
    "about   — conocer al desarrollador",
    "skills  — ver habilidades principales",
    "projects — listar proyectos",
    "contact — información de contacto",
    "clear   — limpiar la terminal"
  ],
  about: [
    "IDENTIDAD: Cristopher Hurtado",
    "PERFIL: Ingeniero en sistemas (visión imaginada para 2036)",
    "ENFOQUE: Desarrollo web, sistemas, IA y tecnología útil.",
    "FILOSOFÍA: aprender, construir y compartir."
  ],
  skills: [
    "MÓDULOS DE HABILIDAD:",
    "HTML / CSS ............ 95%",
    "JAVASCRIPT ............ 88%",
    "BASES DE DATOS ........ 84%",
    "REDES Y SISTEMAS ...... 82%",
    "PYTHON / IA ........... 78%",
    "Nota: porcentajes ilustrativos del perfil futuro."
  ],
  projects: [
    "ARCHIVOS DISPONIBLES:",
    "01 NEXUS CONTROL — plataforma web conceptual",
    "02 ORBIT AI — prototipo de asistente digital",
    "03 CYBER SHIELD — panel educativo de seguridad"
  ],
  contact: [
    "CANAL DE CONTACTO:",
    "Correo: cristohur7@gmail.com",
    "Telefono: +593 97 948 7413",
    "Estado: Discponible para cualquier proyecto o colaboración tecnológica.",
  ]
};
function addTerminalLine(text, className = "") {
  const line = document.createElement("p");
  if (className) line.className = className;
  line.textContent = text;
  terminalOutput.appendChild(line);
}
function runCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase();
  if (!command) return;
  addTerminalLine(`visitor@cr-sys:~$ ${rawCommand}`, "output-highlight");
  if (command === "clear") {
    terminalOutput.replaceChildren();
    return;
  }
  if (terminalCommands[command]) {
    terminalCommands[command].forEach(line => addTerminalLine(line));
  } else {
    addTerminalLine(`Comando no reconocido: "${rawCommand}". Escribe help para ver las opciones.`, "error");
  }
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}
terminalForm.addEventListener("submit", event => {
  event.preventDefault();
  runCommand(terminalInput.value);
  terminalInput.value = "";
  terminalInput.focus();
});
commandHints.forEach(button => button.addEventListener("click", () => {
  const command = button.dataset.command;
  if (command === "clear") {
    terminalOutput.replaceChildren();
    addTerminalLine("Terminal limpiada. Escribe help para comenzar.");
  } else {
    runCommand(command);
  }
}));

// Mensaje breve al llegar a la sección de contacto
const toast = $("#toast");
let toastTimer;
const contactLink = document.querySelector('.contact-box a[href^="mailto:"]');
contactLink.addEventListener("click", () => {
  toast.textContent = "Se abrirá tu aplicación de correo.";
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
});
