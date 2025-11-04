const USERS = require("../modelo/users.json");

checkExamStatus = (req, res) => {
    const userId = req.userId; 
    const certName = "Python"; 

    const user = USERS.find(u => u.cuenta === userId);

    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado en la base de datos." });
    }

    // Usamos las propiedades del modelo de usuario
    const estaPagado = user.paid; 
    const esPrimerIntento = !user.hasAttempt;

    if (estaPagado && esPrimerIntento) {
        // Todas las condiciones cumplen
        return res.status(200).json({ 
            status: "OK", 
            message: `Acceso concedido para la certificación de ${certName}.`,
            paid: true,
            hasAttempt: false
        });
    }

    // Alguna condición NO cumple (Errores)
    if (!estaPagado) {
        return res.status(403).json({ 
            status: "Forbidden", 
            error: `Pago pendiente. Debes pagar la certificación de ${certName} para iniciar el examen.` 
        });
    }

    if (!esPrimerIntento) {
        return res.status(403).json({ 
            status: "Forbidden", 
            error: "Ya has realizado un intento para este examen." 
        });
    }

    return res.status(400).json({ error: "No se cumplen las condiciones para iniciar el examen." });
};

module.exports = { checkExamStatus };