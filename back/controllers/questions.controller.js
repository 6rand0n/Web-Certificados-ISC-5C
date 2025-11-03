const { text } = require("body-parser");
const QUESTIONS = require("../data/questions");
const USERS = require("../modelo/users.json");

let seleccionadas = []; // ocupo esto para submitAnswers

// -------------------------------------------------------------------------------------------
// De base mandar la preguntas al front
const startQuiz = (req, res) => {
      const userId = req.userId; // viene del token
  const user = USERS.find(u => u.cuenta === userId);

  if (!user) {
    return res.status(404).json({ error: "Requieres un usuario registrado" });
  }

  if (!user.paid) {
    return res.status(403).json({ error: "Ocupas pagar el examen" });
  }

  if (user.hasAttempt) {
    return res.status(403).json({ error: "El examen solo se puede aplicar una vez" });
  }
    // Hace un arreglo aleatorio de preguntas
    const mezclar = QUESTIONS.sort(() => 0.5 - Math.random());

    seleccionadas = mezclar.slice(0, 8); // solo tomar 8

    const publicQuestions = seleccionadas.map(({id, text, options}) => ({
        id, text, options: [...options].sort(() => 0.5 - Math.random()) // mezcla opciones también
    }));

    user.hasAttempt = true; // como lo esta haciendo levantamos la bandera de intento de examen

    console.log(`[QUIZ] Usuario ${user.cuenta} inició examen`);
    console.log("Preguntas enviadas");
    res.status(200).json({
        message: "Preguntas listas. ¡Éxito!",
        questions: publicQuestions
    });
}

// Fin de enviar preguntas al front
// ------------------------------------------------------------------------------------------

// Recibir y evaluar las respuestas
// ------------------------------------------------------------------------------------------
const submitAnswers = (req, res) => {
    // Tomar respuestas enviadas por el usuario
    console.log("Respuestas recibidas", JSON.stringify(req.body, null, 2));

    // Aqui verificacion para evitar que el servidor no truene
    const userAnswers = Array.isArray(req.body.answers) ? req.body.answers : [];

    // Inicializacion de puntaje y arreglo de detalles
    let score = 0;
    const details = [];

    // Recorre todas las preguntas
    for(const q of seleccionadas){
        // Busca la respuesta enviada por id
        const user = userAnswers.find(a => a.id === q.id);

        // Verificar si es correcta
        //isCorrect será verdadero solo si existe user y además la respuesta del usuario es igual a la correcta
        const isCorrect = !!user && user.answer === q.correct;

        // Suma el puntaje si es correcto
        if(isCorrect) score++;

        // Agrega la informacion de la pregunta
        details.push({
            id: q.id,
            text: q.text,
            yourAnswer: user ? user.answer : null,
            correctAnswer: q.correct,
            correct: isCorrect
        });
    }

    //4 Enviar resultado
    return res.status(200).json({
        message: "Respuestas evaluadas.",
        score,
        total: QUESTIONS.length / 2, // esto es porque son la mitad
        details
    });
};

module.exports = { startQuiz, submitAnswers };