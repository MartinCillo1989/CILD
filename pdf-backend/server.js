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

// Middleware para procesar JSON y form-data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para recibir el PDF y otros archivos
app.post("/upload-pdf", upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'file1', maxCount: 1 },
  { name: 'file2', maxCount: 1 },
  { name: 'file3', maxCount: 1 },
  { name: 'file4', maxCount: 1 } // Para el archivo MP3
]), async (req, res) => {
  const { files, body } = req; // Añadimos body aquí para recoger los datos enviados desde el frontend
  const { formName } = body; // Desestructuramos formName del body

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
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
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
      subject: `Formulario ${formName}`, // Incluimos formName en el asunto
      text: `Adjunto encontrarás el formulario ${formName} en formato PDF y otros archivos.`,
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
