const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); // Cargar variables de entorno

const app = express();
const PORT = 3000;

// Configuración de Multer para manejar archivos subidos
const upload = multer({ dest: "uploads/" });

// Middleware para procesar JSON
app.use(bodyParser.json());

// Ruta para recibir el PDF y otros archivos
app.post("/upload-pdf", upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'file1', maxCount: 1 },
  { name: 'file2', maxCount: 1 },
  { name: 'file3', maxCount: 1 },
  { name: 'file4', maxCount: 1 } // Para el archivo MP3
]), async (req, res) => {
  const { files } = req;

  if (!files || !files.pdf) {
    return res.status(400).send("No se recibió ningún archivo PDF.");
  }

  try {
    // Configurar Nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Usa SSL
      auth: {
        user: 'cillomartin.89@gmail.com',
        pass: 'obbb gscq oqpe dfsd', // Usa la App Password generada
      },
    });

    const attachments = [
      {
        filename: files.pdf[0].originalname,
        path: path.resolve(files.pdf[0].path),
      },
    ];

    // Adjuntar otros archivos si existen
    ['file1', 'file2', 'file3', 'file4'].forEach(fieldName => {
      if (files[fieldName]) {
        attachments.push({
          filename: files[fieldName][0].originalname,
          path: path.resolve(files[fieldName][0].path),
        });
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "cillo_747@hotmail.com", // Cambia al correo del destinatario
      subject: "Formulario PDF y Archivos Adjuntos",
      text: "Adjunto encontrarás el formulario en formato PDF y otros archivos.",
      attachments: attachments,
    };

    // Enviar correo
    await transporter.sendMail(mailOptions);

    // Eliminar los archivos después de enviarlos
    attachments.forEach((attachment) => {
      fs.unlinkSync(attachment.path);
    });

    res.status(200).send("PDF y archivos enviados correctamente.");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).send("Error al enviar el correo.");
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
