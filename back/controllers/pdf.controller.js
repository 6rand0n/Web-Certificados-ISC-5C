const PDFDocument = require('pdfkit');
const USERS = require("../modelo/users.json"); 

const CERTIFICACION_INFO = {
    cert_nombre: "Entry Level Python Programmer",
    ciudad: "Aguascalientes, Ags.",
    compania_nombre: "Absolute Learning",
    instructor_nombre: "Bernardino Esparza Lopez",
    ceo_nombre: "Angelica Martinez Arias",
    logo: "../front/images/logo_3.png",
    firma_instructor: "../front/images/BFirma.png",
    firma_ceo: "../front/images/AriasFirma.png",
};


generateCertificate = (req, res) => {
    const userId = req.userId; 
    const user = USERS.find(u => u.cuenta === userId);

    if (!user) {
        return res.status(404).end("Usuario no encontrado o no autorizado.");
    }

    // Preparar los datos
    const fechaHoy = new Date();
    const opcionesFormato = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaFormateada = fechaHoy.toLocaleDateString('es-ES', opcionesFormato); 

    const nombreCompleto = user.nombre;

    const doc = new PDFDocument({
        layout: 'landscape', 
        size: 'A4',
        margin: 50
    });

    // Colores base
    const mainColor = '#1e3d58'; 
    const accentColor = '#447594';
    const width = doc.page.width;
    const height = doc.page.height;


    // Configurar las cabeceras de respuesta HTTP
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Certificado_${user.cuenta}.pdf"`);

    doc.pipe(res);

    // --- DECORACIÓN: BORDE DE MARCO ---
    const borderMargin = 20;
    const innerMargin = 30;

    // Borde exterior (línea gruesa)
    doc.lineWidth(5).strokeColor(mainColor)
       .rect(borderMargin, borderMargin, width - 2 * borderMargin, height - 2 * borderMargin)
       .stroke();
    
    // Borde interior (línea delgada)
    doc.lineWidth(1).strokeColor(accentColor)
       .rect(innerMargin, innerMargin, width - 2 * innerMargin, height - 2 * innerMargin)
       .stroke();


    // --- CONTENIDO DEL CERTIFICADO ---

    // COLOCAR LOGOTIPO (en el centro superior IZQUIERDA)
    const logoSize = 60;
    const logoMarginLeft = 40;
    
    doc.image(CERTIFICACION_INFO.logo, logoMarginLeft, 40, { width: logoSize }); 
    
    // AJUSTAR Y INICIAL para el texto principal
    doc.y = 70; 
    
    // Logotipo y Nombre de la Compañía (Alineado al centro)
    doc.font('Helvetica-Bold').fontSize(28).fillColor(mainColor).text(CERTIFICACION_INFO.compania_nombre.toUpperCase(), { align: 'center' });
    
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fontSize(40).fillColor('#333333').text('CERTIFICADO DE APROBACIÓN', { align: 'center' });
    
    // LÍNEA DE SEPARACIÓN
    doc.moveDown(0.5);
    doc.lineWidth(1).strokeColor(accentColor).moveTo(200, doc.y).lineTo(width - 200, doc.y).stroke();
    doc.moveDown(0.5);

    doc.font('Helvetica').fontSize(16).fillColor('#555555').text('Se otorga el presente certificado a:', { align: 'center' });
    
    doc.moveDown(0.5);

    // Nombre Completo del Usuario 
    doc.font('Helvetica-Bold').fontSize(36).fillColor(mainColor).text(nombreCompleto.toUpperCase(), { align: 'center' });

    doc.moveDown(1);
    
    // Título de la Certificación
    doc.font('Helvetica').fontSize(16).fillColor('#555555').text('Por completar satisfactoriamente la certificación:', { align: 'center' });
    doc.font('Helvetica-Bold').fontSize(24).fillColor('#333333').text(CERTIFICACION_INFO.cert_nombre, { align: 'center' });

    // LÍNEA DE SEPARACIÓN (Parte inferior)
    doc.moveDown(0.5);
    doc.lineWidth(1).strokeColor(accentColor).moveTo(200, doc.y).lineTo(width - 200, doc.y).stroke();
    doc.moveDown(1);
    
    doc.font('Helvetica').fontSize(12).fillColor('#555555').text(`Expedido en ${CERTIFICACION_INFO.ciudad} el día ${fechaFormateada}.`, { align: 'center' });

    // Firmas
    const ySignatures = doc.y + 40; 
    const signatureWidth = 250;
    const rightMargin = 100; // Margen derecho para el CEO
    const signatureImageHeight = 40; 
    const lineOffset = 5; 
    
    // --- BLOQUE INSTRUCTOR (Izquierda) ---
    doc.y = ySignatures;
    doc.x = 100; // Margen izquierdo fijo
    
    // IMAGEN DE FIRMA
    doc.image(CERTIFICACION_INFO.firma_instructor, doc.x + 75, doc.y - signatureImageHeight + lineOffset, { width: 100, height: signatureImageHeight });

    // Línea de firma
    doc.fillColor('#000000').text(`_________________________`, { align: 'center', width: signatureWidth });
    doc.moveDown(0.2);
    
    // Nombre y Rol
    doc.font('Helvetica-Bold').fontSize(12).text(CERTIFICACION_INFO.instructor_nombre, { align: 'center', width: signatureWidth });
    doc.font('Helvetica').fontSize(10).text('Instructor Certificado', { align: 'center', width: signatureWidth });


    // --- BLOQUE CEO (Derecha, AL MISMO Y) ---
    doc.y = ySignatures; 
    doc.x = width - rightMargin - signatureWidth; 

    // IMAGEN DE FIRMA
    doc.image(CERTIFICACION_INFO.firma_ceo, doc.x + 75, doc.y - signatureImageHeight + lineOffset, { width: 100, height: signatureImageHeight });

    // Línea de firma
    doc.fillColor('#000000').text(`_________________________`, { align: 'center', width: signatureWidth });
    doc.moveDown(0.2);
    
    // Nombre y Rol
    doc.font('Helvetica-Bold').fontSize(12).text(CERTIFICACION_INFO.ceo_nombre, { align: 'center', width: signatureWidth }); 
    doc.font('Helvetica').fontSize(10).text(`CEO, ${CERTIFICACION_INFO.compania_nombre}`, { align: 'center', width: signatureWidth });
    
    
    doc.end();
};

module.exports = { generateCertificate };