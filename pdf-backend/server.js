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

// Ruta para recibir el PDF
app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
    const { file } = req;

    if (!file) {
        return res.status(400).send("No se recibió ningún archivo.");
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

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "cristobalhb@live.com", // Cambia al correo del destinatario
            subject: "Formulario PDF",
            text: "Adjunto encontrarás el formulario en formato PDF.",
            attachments: [
                {
                    filename: file.originalname,
                    path: path.resolve(file.path), // Ruta del archivo subido
                },
            ],
        };

        // Enviar correo
        await transporter.sendMail(mailOptions);

        // Eliminar el archivo después de enviarlo
        fs.unlinkSync(file.path);

        res.status(200).send("PDF enviado correctamente.");
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        res.status(500).send("Error al enviar el correo.");
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
