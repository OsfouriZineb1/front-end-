document.addEventListener("DOMContentLoaded", function () {
    const examForm = document.getElementById("exam-form");
    const examList = document.getElementById("exam-list");

    // Soumission du formulaire pour ajouter un examen
    if (examForm) {
        examForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const name = document.getElementById("exam-name").value;
            const date = document.getElementById("exam-date").value;

            if (name && date) {
                // Génération d'un ID unique basé sur le timestamp
                const examId = new Date().getTime(); // ID unique basé sur l'heure actuelle

                const examData = { id: examId, name, date };

                // Récupérer les examens existants dans localStorage ou créer un tableau vide si aucun examen
                let exams = JSON.parse(localStorage.getItem("exams")) || [];
                exams.push(examData); // Ajouter le nouvel examen au tableau
                localStorage.setItem("exams", JSON.stringify(exams)); // Sauvegarder dans localStorage

                generateQRCode(name, date);
                displayExams(); // Rafraîchir la liste des examens affichés
            }
        });
    }

    // Fonction pour afficher les examens à partir du localStorage
    function displayExams() {
        const exams = JSON.parse(localStorage.getItem("exams")) || [];
        examList.innerHTML = ''; // Effacer la liste existante avant d'ajouter les nouveaux examens

        exams.forEach(exam => {
            // Créer un conteneur pour chaque examen dans un div séparé
            const examContainer = document.createElement("div");
            examContainer.classList.add("exam-item"); // Ajouter une classe CSS pour les styles

            examContainer.innerHTML = `
                <div>
                    <h3>${exam.name}</h3>
                    <p>ID: ${exam.id}</p>
                    <p>Date: ${exam.date}</p>
                    <button class="delete-btn" data-id="${exam.id}">Supprimer</button> <!-- Bouton supprimer -->
                </div>
            `;

            // Ajouter l'examen à la liste
            examList.appendChild(examContainer);

            // Ajouter un gestionnaire d'événement pour le bouton supprimer
            const deleteBtn = examContainer.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", function () {
                deleteExam(exam.id); // Appel de la fonction pour supprimer l'examen
            });
        });
    }

    // Fonction pour supprimer un examen par son ID
    function deleteExam(examId) {
        let exams = JSON.parse(localStorage.getItem("exams")) || [];
        // Filtrer les examens pour enlever celui ayant l'ID correspondant
        exams = exams.filter(exam => exam.id !== examId);

        // Mettre à jour le localStorage avec la liste mise à jour
        localStorage.setItem("exams", JSON.stringify(exams));
        displayExams(); // Rafraîchir la liste des examens affichés
    }

    // Initialiser la liste des examens dès que le document est chargé
    displayExams();
});

// Fonction pour générer le QR Code
function generateQRCode(name, date) {
    const qrContainer = document.getElementById("qr-code-container");
    qrContainer.innerHTML = ""; // Effacer le QR code précédent
    new QRCode(qrContainer, `${name} - ${date}`); // Générer le QR code avec le nom et la date
}
