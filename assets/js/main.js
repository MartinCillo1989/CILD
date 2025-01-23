/**
* Template Name: AgriCulture
* Template URL: https://bootstrapmade.com/agriculture-bootstrap-website-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/


/*FUNCIONES DEL FORMULARIO*/

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('generatePdf').addEventListener('click', async function () {
    const { jsPDF } = window.jspdf;
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    const doc = new jsPDF();

    // Función para obtener valores de un elemento
    const getElementValue = (id) => {
      const element = document.getElementById(id);
      return element ? element.value : '';
    };

    // Capturar datos del formulario
    const name = getElementValue('inputName');
    const lastName = getElementValue('inputLastName');
    const email = getElementValue('inputEmail');
    const dni = getElementValue('inputDni');
    const fechaNacimiento = getElementValue('inputBirthDate');
    const edad = getElementValue('inputEdad');
    const ciudadania = getElementValue('inputCiudadania');
    const modalidad = getElementValue('inputModalidad');
    const nombreCoreo = getElementValue('inputObra');
    const categoria = getElementValue('inputCategoria');
    const cantidadIntegrantes = getElementValue('inputCantidad');
    const division = getElementValue('inputDivision');
    const compiteEnCoreografia = document.querySelector('input[name="coreografia"]:checked')?.value || "No especificado";
    const tipoCoreo = getElementValue('inputWebsite');

    // Crear contenido principal del PDF
    doc.setFontSize(12);
    doc.text(`Nombre: ${name}`, 10, 10);
    doc.text(`Apellido: ${lastName}`, 10, 20);
    doc.text(`Correo electrónico: ${email}`, 10, 30);
    doc.text(`Dni: ${dni}`, 10, 40);
    doc.text(`Fecha de nacimiento: ${fechaNacimiento}`, 10, 50);
    doc.text(`Edad: ${edad}`, 10, 60);
    doc.text(`Ciudadanía: ${ciudadania}`, 10, 70);
    doc.text(`Modalidad: ${modalidad}`, 10, 80);
    doc.text(`Nombre coreo: ${nombreCoreo}`, 10, 90);
    doc.text(`Categoría: ${categoria}`, 10, 100);
    doc.text(`Cantidad de integrantes: ${cantidadIntegrantes}`, 10, 110);
    doc.text(`Division: ${division}`, 10, 120);
    doc.text(`Coreografía: ${compiteEnCoreografia}`, 10, 130);
    doc.text(`Tipo de coreo: ${tipoCoreo}`, 10, 140);

    // Función para procesar un archivo PDF
    const processFile = async (file, doc) => {
      if (file && file.type === "application/pdf") {
        const fileReader = new FileReader();
        return new Promise((resolve) => {
          fileReader.onload = async function () {
            const pdfData = new Uint8Array(this.result);

            // Cargar el PDF usando PDF.js
            const loadingTask = pdfjsLib.getDocument({ data: pdfData });
            const pdf = await loadingTask.promise;

            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const viewport = page.getViewport({ scale: 1 });

              // Crear un canvas temporal para renderizar la página
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.width = viewport.width;
              canvas.height = viewport.height;

              await page.render({ canvasContext: context, viewport: viewport }).promise;

              // Convertir el canvas a imagen y añadirla al PDF generado
              const imgData = canvas.toDataURL('image/png');
              doc.addPage();
              doc.addImage(imgData, 'PNG', 10, 10, 190, 277);
            }
            resolve();
          };
          fileReader.readAsArrayBuffer(file);
        });
      }
    };

    // Obtener y procesar los archivos cargados
    const fileInputs = ['inputFile1', 'inputFile2', 'inputFile3', 'inputFile4']; // IDs de los campos de archivo
    for (const inputId of fileInputs) {
      const fileInput = document.getElementById(inputId);
      if (fileInput && fileInput.files.length > 0) {
        await processFile(fileInput.files[0], doc);
      }
    }

    // Guardar el PDF combinado
    const pdfBlob = doc.output("blob");

    // Enviar el PDF y los archivos al servidor
    const formData = new FormData();
    formData.append("pdf", pdfBlob, "formulario_con_archivos.pdf");
    for (const inputId of fileInputs) {
      const fileInput = document.getElementById(inputId);
      if (fileInput && fileInput.files.length > 0) {
        formData.append(fileInput.name, fileInput.files[0]);
      }
    }

    try {
      const response = await fetch("http://localhost:3000/upload-pdf", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("PDF y archivos enviados al servidor con éxito.");
      } else {
        alert("Error al enviar el PDF y archivos al servidor.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor.");
    }

  });
});




(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Scroll up sticky header to headers with .scroll-up-sticky class
   */
  let lastScrollTop = 0;
  window.addEventListener('scroll', function() {
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky')) return;

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > selectHeader.offsetHeight) {
      selectHeader.style.setProperty('position', 'sticky', 'important');
      selectHeader.style.top = `-${header.offsetHeight + 50}px`;
    } else if (scrollTop > selectHeader.offsetHeight) {
      selectHeader.style.setProperty('position', 'sticky', 'important');
      selectHeader.style.top = "0";
    } else {
      selectHeader.style.removeProperty('top');
      selectHeader.style.removeProperty('position');
    }
    lastScrollTop = scrollTop;
  });

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Auto generate the carousel indicators
   */
  document.querySelectorAll('.carousel-indicators').forEach((carouselIndicator) => {
    carouselIndicator.closest('.carousel').querySelectorAll('.carousel-item').forEach((carouselItem, index) => {
      if (index === 0) {
        carouselIndicator.innerHTML += `<li data-bs-target="#${carouselIndicator.closest('.carousel').id}" data-bs-slide-to="${index}" class="active"></li>`;
      } else {
        carouselIndicator.innerHTML += `<li data-bs-target="#${carouselIndicator.closest('.carousel').id}" data-bs-slide-to="${index}"></li>`;
      }
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

})()
;

