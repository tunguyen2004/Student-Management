async function includeHTML(id, file, callback) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error("Không thể tải file " + file);

    el.innerHTML = await res.text();

    // Đánh dấu menu active sau khi header load
    if (id === "header") highlightActiveMenu();

    if (callback) callback(); // Execute the callback function
  } catch (err) {
    console.error(err);
  }
}

function highlightActiveMenu() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".menu-link");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (currentPath.includes(href)) {
      link.classList.add("active");
    }
  });
}

function openModal(modalId, title) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const modalTitle = modal.querySelector('.modal-header h2');
        if (modalTitle && title) {
            modalTitle.textContent = title;
        }
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}
