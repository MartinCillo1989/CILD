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
    const formData = {
      'Nombre': getElementValue('inputName'),
      'Apellido': getElementValue('inputLastName'),
      'Correo electrónico': getElementValue('inputEmail'),
      'Dni': getElementValue('inputDni'),
      'Fecha de nacimiento': getElementValue('inputBirthDate'),
      'Edad': getElementValue('inputEdad'),
      'Ciudadanía': getElementValue('inputCiudadania'),
      'Modalidad': getElementValue('inputModalidad'),
      'Nombre coreo': getElementValue('inputObra'),
      'Categoría': getElementValue('inputCategoria'),
      'Cantidad de integrantes': getElementValue('inputCantidad'),
      'Division': getElementValue('inputDivision'),
      'Coreografía': document.querySelector('input[name="coreografia"]:checked')?.value || "No especificado",
      'Tipo de coreo': getElementValue('inputWebsite'),
      'Grand prix categoría': document.querySelector('input[name="categoria"]:checked')?.value || "No especificado",
      'Grand prix división': document.querySelector('input[name="division"]:checked')?.value || "No especificado",
      'Primera variación clásica': getElementValue('inputPrimeravariacion'),
      'Segunda variación clásica': getElementValue('inputSegundavariacion'),
      'Coreografía de contemporáneo': getElementValue('inputCoreoContem'),
      'Duración contemporáneo': getElementValue('inputDuracionContem'),
      'Pas de Deux': getElementValue('inputPasDeDeux'),
      'Formulario': getElementValue('formName') // Incluimos el campo oculto formName aquí
    };

    // Crear contenido principal del PDF
    doc.setFontSize(12);
    let yPos = 10; // Posición inicial en Y para el texto

    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        doc.text(`${key}: ${value}`, 10, yPos);
        yPos += 10; // Incrementa la posición Y para la siguiente línea de texto
      }
    });

    // Guardar el PDF generado en un Blob
    const pdfBlob = doc.output('blob');

    // Recoger los archivos adicionales del formulario
    const fileInputs = ['inputFile1', 'inputFile2']; // Ajusta los IDs según tus inputs de archivo
    const formDataToSend = new FormData();
    formDataToSend.append("pdf", pdfBlob, "formulario_con_archivos.pdf");

    // Añadir el nombre del formulario al FormData
    formDataToSend.append("formName", getElementValue('formName')); // Aquí se añadió esta línea

    for (const inputId of fileInputs) {
      const fileInput = document.getElementById(inputId);
      if (fileInput && fileInput.files.length > 0) {
        formDataToSend.append(fileInput.name, fileInput.files[0]);
      }
    }

    try {
      const response = await fetch("http://localhost:3000/upload-pdf", {
        method: "POST",
        body: formDataToSend,
      });
      if (response.ok) {
        alert("PDF y archivos enviados al servidor con éxito.");
      } else {
        alert("Error al enviar el PDF y archivos al servidor.");
      }
    } catch (error) {
      // Agregamos más detalles al mensaje de error en el catch
      console.error("Error:", error);
      alert(`Error al conectar con el servidor. Detalles del error: ${error.message}`);
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

