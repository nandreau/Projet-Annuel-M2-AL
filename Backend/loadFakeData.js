// loadFakeData.js
require("dotenv").config();
const { faker } = require("@faker-js/faker/locale/fr");
const db = require("./app/models");
const {
  User,
  Role,
  Chantier,
  Phase,
  Task,
  Assignment,
  Problem,
  ProblemMessage,
  sequelize,
} = db;

module.exports = async function loadFakeData() {
  await sequelize.sync({ force: true });

  // Listes statiques pour des données en français
  const chantierNames = [
    "Résidence des Oliviers",
    "Immeuble Bellevue",
    "Centre Commercial Arc-en-Ciel",
    "Villa des Fleurs",
    "Bureaux du Parc",
    "Résidence du Lac",
    "Tour Montparnasse",
    "Campus de la Plaine",
    "Hangar des Artisans",
    "Domaine de la Forêt",
    "Galerie Marchande du Sud",
    "Lofts du Canal",
    "Écoquartier des Lumières",
    "Manoir du Château",
    "Parc d’Affaires Horizon",
    "Quartier du Moulin",
    "Îlot des Artistes",
    "Hall d’Entrée du Palais",
    "Ensemble Résidentiel Vermeil",
    "Domaine du Soleil",
    "Maison du Parc",
    "Résidence du Ruisseau",
    "Centre d'Affaires Lyon",
    "Tour des Vignes",
    "Villa des Roses",
    "Halles Marchandes",
    "Loft Industriel",
    "Carré des Entrepreneurs",
    "Domaine du Château-Vieux",
    "Place de la République",
    ];

    const phaseNames = [
    "Plomberie",
    "Électricité",
    "Carrelage",
    "Peinture",
    "Toiture",
    "Maçonnerie",
    "Menuiserie",
    "Climatisation",
    "Isolation thermique",
    "Étanchéité",
    "Revêtement de sol",
    "Démolition",
    "Charpente",
    "Serrurerie",
    "Vitrerie",
    "Chauffage",
    "Ventilation",
    "Cloisons sèches",
    "Ponçage",
    "Vernissage",
    "Câblage réseau",
    "Pose de gypse",
    "Goudronnage",
    "Ravalement de façade",
    "Projection de béton",
    "Aménagement paysager",
    "Crépis décoratifs",
    "Montage de structures",
    "Traitement humidité",
    "Désamiantage",
    ];

    const taskNames = [
    "Réparation de canalisation",
    "Remplacement de disjoncteur",
    "Pose de carrelage mural",
    "Application de sous-couche",
    "Réfection de tuiles",
    "Installation de radiateur",
    "Réglage de robinetterie",
    "Ponçage de plancher",
    "Vernissage de poutres",
    "Mise en place de gaines électriques",
    "Réalisation de coffrage",
    "Installation de menuiserie extérieure",
    "Pose de faux plafond",
    "Montage de charpente",
    "Réglage de système HVAC",
    "Câblage informatique",
    "Pose de revêtement PVC",
    "Fixation de garde-corps",
    "Installation de volets roulants",
    "Réglage de serrure de sécurité",
    "Nettoyage haute pression",
    "Installation de néons LED",
    "Révision de pompe à chaleur",
    "Assemblage d'échafaudage",
    "Réparations ponctuelles de fissures",
    "Pose de profilés métalliques",
    "Test d'étanchéité aux gaz",
    "Mise à niveau de sol",
    "Montage de murs mobiles",
    ];

    const problemTitles = [
    "Fuite d'eau au niveau du 2ème étage",
    "Panne générale d'électricité",
    "Carrelage fissuré dans la cuisine",
    "Peinture écaillée dans le salon",
    "Tuiles manquantes sur le toit",
    "Chauffage en panne dans les combles",
    "Fenêtre mal étanchéisée",
    "Fissures dans le mur porteur",
    "Ventilation défectueuse",
    "Portail automatique bloqué",
    "Ascenseur en arrêt d'urgence",
    "Éclairage de parking hors service",
    "Gouttière obstruée",
    "Baignoire fissurée",
    "Plancher qui craque",
    "Toit qui laisse passer l'eau",
    "Moustiquaires déchirées",
    "Peinture moisie",
    "Climatisation qui fuit",
    "Convecteur hors service",
    "Colonne montante bouchée",
    "Rideau métallique grippé",
    "Crépissage qui s'effrite",
    "Escalier glissant",
    "Corniche détériorée",
    "Porte blindée voilée",
    "Isolation insuffisante",
    "Évacuation encombrée",
    "Balustrade branlante",
    "Dalles soulevées",
    ];

    const problemDescriptions = [
    "Une fuite d'eau importante a été détectée dans le couloir.",
    "L'ensemble du tableau électrique a sauté ce matin.",
    "Plusieurs carreaux sont fissurés suite à un choc.",
    "La peinture commence à s'écailler après l'humidité.",
    "Des tuiles se sont envolées avec le dernier coup de vent.",
    "Le chauffage ne s'allume plus, même après réinitialisation.",
    "De l'eau s'infiltre autour de la fenêtre lors de fortes pluies.",
    "Des craquelures apparaissent dans la maçonnerie du mur nord.",
    "La ventilation émet un bruit strident en continu.",
    "Le portail refuse de se fermer automatiquement.",
    "L'ascenseur est bloqué entre deux étages.",
    "Les lampadaires extérieurs ne fonctionnent plus.",
    "Les gouttières sont pleines de feuilles et débordent.",
    "La baignoire présente une fissure sous le trop-plein.",
    "Le plancher grince fortement à chaque pas.",
    "Le toit laisse pénétrer l'eau par temps de pluie.",
    "Les moustiquaires sont déchirées aux fenêtres.",
    "La peinture est tachée par des moisissures.",
    "La climatisation goutte dans le bureau.",
    "Le convecteur ne chauffe plus du tout.",
    "La colonne d'eau est partiellement obstruée.",
    "Le rideau métallique est grippé à l'ouverture.",
    "Le crépis de façade s'effrite par endroits.",
    "Les marches de l'escalier sont glissantes.",
    "La corniche extérieure est endommagée.",
    "La porte blindée ne ferme plus parfaitement.",
    "L'isolation laisse passer le froid.",
    "L'évacuation des eaux usées est lente.",
    "La balustrade du balcon est instable.",
    "Les dalles de la terrasse sont soulevées.",
    ];

    const messageContents = [
    "J'ai constaté le problème ce matin.",
    "Nous sommes en cours d'intervention.",
    "Le devis a été envoyé au client.",
    "Le chantier est momentanément interrompu.",
    "Les pièces de rechange ont été commandées.",
    "Le fournisseur livre demain matin.",
    "Un technicien sera sur place cet après-midi.",
    "Le système a été redémarré, en attente de test.",
    "La zone a été sécurisée par un périmètre.",
    "Un rapport d'expertise a été demandé.",
    "Le matériel défectueux a été identifié.",
    "Le chantier rouvrira la semaine prochaine.",
    "L'accès a été rétabli temporairement.",
    "Le responsable qualité valide l'intervention.",
    "Une réunion de chantier est programmée.",
    "Les plans ont été mis à jour aujourd'hui.",
    "La commande doit arriver d'ici deux jours.",
    "Le dossier technique est incomplet.",
    "L'équipe de nuit reprend les travaux.",
    "Le contrôle visuel est satisfaisant.",
    "Une consigne de sécurité a été émise.",
    "Le client a approuvé les travaux.",
    "Le rapport photographique a été fait.",
    "Le budget a été révisé à la hausse.",
    "La partie électrique a été testée.",
    "Le nivellement est en cours.",
    "Le traitement anti-humidité a débuté.",
    "La pose des menuiseries démarre demain.",
    "L'échafaudage est prêt à être démonté.",
    "Le sol a été balayé et nettoyé.",
    ];

  // 1) rôles
  const roleNames = ['client', 'artisan', 'moderator', 'admin'];
  await Role.bulkCreate(roleNames.map((name, idx) => ({ id: idx + 1, name })));

  // 2) utilisateurs
  const users = [{
    firstname: "Aurélien",
    name: "Penot",
    email: "aurelien@gmail.com",
    job: ["PDG"],
    avatar: faker.image.avatar(),
    password: "$2a$08$36NBre.ckxhWoQpVNA1AROClrqTQpLgWIiD1IqtoXYmvA704rtOc.", // Azerty123
  }];
  for (let i = 0; i < 100; i++) {
    users.push({
      firstname: faker.person.firstName(),
      name: faker.person.lastName(),
      email: faker.internet.email(),
      job: [faker.person.jobTitle()],
      avatar: faker.image.avatar(),
      password: "$2a$08$36NBre.ckxhWoQpVNA1AROClrqTQpLgWIiD1IqtoXYmvA704rtOc.", // Azerty123
    });
  }
  await User.bulkCreate(users);
  for (const user of await User.findAll()) {
    const roleId = user.email === "aurelien@gmail.com"
      ? 4 // admin
      : faker.number.int({ min: 1, max: 3 });
    await user.setRoles([await Role.findByPk(roleId)]);
  }

  // Get all users who have the "artisan" role
  const artisanRole = await Role.findOne({ where: { name: 'artisan' } });
  const artisanUsers = artisanRole
    ? await artisanRole.getUsers({ attributes: ['id'] })
    : [];

  // 3) chantiers / phases / tâches / plannings
  for (let i = 0; i < 5; i++) {
    const chantier = await Chantier.create({
      title: faker.helpers.arrayElement(chantierNames),
      address: faker.location.streetAddress(),
      start: faker.date.past({ years: 1 }),
      end: faker.date.future({ years: 1 }),
      images: '',
      clientId: faker.number.int({ min: 1, max: 100 }),
    });

    for (let p = 0; p < faker.number.int({ min: 2, max: 4 }); p++) {
      const phase = await Phase.create({
        name: faker.helpers.arrayElement(phaseNames),
        chantierId: chantier.id,
      });


      for (let t = 0; t < faker.number.int({ min: 2, max: 6 }); t++) {
        const usedDates = new Set();

        const task = await Task.create({
          name: faker.helpers.arrayElement(taskNames),
          done: faker.datatype.boolean(),
          dueDate: faker.date.future(),
          doneDate: faker.datatype.boolean() ? faker.date.recent() : null,
          images: [],
          phaseId: phase.id,
        });

        if (!task.done) {
          const assignmentsToCreate = faker.number.int({ min: 15, max: 20 });
          let createdAssignments = 0;

          while (createdAssignments < assignmentsToCreate && usedDates.size < 22) {
            const dayOffset = faker.number.int({ min: 0, max: 30 });
            const baseDate = new Date();
            baseDate.setDate(baseDate.getDate() + dayOffset);

            const dayOfWeek = baseDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

            const dateKey = baseDate.toISOString().split('T')[0];
            if (usedDates.has(dateKey)) continue; // Skip if already used

            usedDates.add(dateKey);

            const startHour = faker.helpers.arrayElement([7, 8, 9, 10, 11, 12]);
            const endHour = faker.helpers.arrayElement([13, 14, 15, 16, 17, 18]);

            const startDate = new Date(baseDate);
            startDate.setHours(startHour, 0, 0, 0);

            const endDate = new Date(baseDate);
            endDate.setHours(endHour, 0, 0, 0);

            const assignment = await Assignment.create({
              startDate,
              endDate,
              taskId: task.id,
            });

            const pickCount = faker.number.int({ min: 1, max: 2 });
            const picked = faker.helpers.arrayElements(artisanUsers, pickCount);
            await assignment.setUsers(picked);

            createdAssignments++;
          }
        }
      }
    }
  }

  // 4) problèmes / messages
  for (let i = 0; i < 50; i++) {
    const problem = await Problem.create({
      title: faker.helpers.arrayElement(problemTitles),
      urgency: faker.helpers.arrayElement(["Urgent","Moyen","Faible"]),
      chantier: faker.helpers.arrayElement(chantierNames),
      phase: faker.helpers.arrayElement(phaseNames),
      task: faker.helpers.arrayElement(taskNames),
      date: faker.date.recent(),
      status: faker.helpers.arrayElement(["En cours","Non résolu","Résolu"]),
      description: faker.helpers.arrayElement(problemDescriptions),
      images: [],
      userId: faker.number.int({ min: 1, max: 100 }),
    });

    for (let m = 0; m < faker.number.int({ min: 1, max: 5 }); m++) {
      await ProblemMessage.create({
        date: faker.date.recent(),
        content: faker.helpers.arrayElement(messageContents),
        problemId: problem.id,
        userId: faker.number.int({ min: 1, max: 100 }),
      });
    }
  }

  console.log("✅ Chargement des données factices terminé");
};
