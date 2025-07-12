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
  Checklist,
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

  const taskTemplates = [
    {
      name: "Réparation de canalisation",
      description: "Inspecter la fuite d’eau visible au plafond du couloir du 2ᵉ étage, identifier la canalisation responsable, remplacer le joint défectueux et vérifier l’absence de nouvelle infiltration pendant au moins 24 heures."
    },
    {
      name: "Remplacement de disjoncteur",
      description: "Diagnostiquer la panne électrique générale, contrôler les fusibles et disjoncteurs du tableau principal, remplacer les composants endommagés puis tester chaque circuit de manière systématique."
    },
    {
      name: "Pose de carrelage mural",
      description: "Décoller les carreaux fissurés, nettoyer la surface, appliquer du mortier-colle, reposer les nouveaux carreaux en suivant le calepinage initial."
    },
    {
      name: "Application de sous-couche",
      description: "Préparer les murs en ponçant puis dépoussiérant, appliquer une sous-couche adaptée, laisser sécher 24 heures avant finition."
    },
    {
      name: "Réfection de tuiles",
      description: "Retirer les tuiles endommagées, nettoyer la surface, poser de nouvelles tuiles et appliquer un traitement hydrofuge si nécessaire."
    },
    {
      name: "Installation de radiateur",
      description: "Fixer le radiateur au mur, raccorder au circuit de chauffage, purger et tester le bon fonctionnement de l’ensemble."
    },
    {
      name: "Réglage de robinetterie",
      description: "Contrôler la pression, démonter la cartouche, remplacer les joints défectueux et tester l’écoulement."
    },
    {
      name: "Ponçage de plancher",
      description: "Utiliser une ponceuse orbitale pour niveler la surface, dépoussiérer, et préparer le sol à la vitrification."
    },
    {
      name: "Vernissage de poutres",
      description: "Décaper les anciennes couches, poncer manuellement, appliquer deux couches de vernis anti-UV."
    },
    {
      name: "Mise en place de gaines électriques",
      description: "Tracer les saignées, installer les gaines ICTA, tirer les câbles selon plan et reboucher proprement."
    },
    {
      name: "Pose de faux plafond",
      description: "Monter la structure métallique, fixer les plaques de plâtre, jointer, enduire et poncer les raccords."
    },
    {
      name: "Montage de charpente",
      description: "Assembler les éléments préfabriqués au sol, lever la charpente avec grue, fixer et sécuriser selon plan."
    },
    {
      name: "Réglage de système HVAC",
      description: "Vérifier la ventilation, calibrer le débit d’air, ajuster la température de consigne et contrôler le retour d’air."
    },
    {
      name: "Pose de revêtement PVC",
      description: "Préparer le sol, découper les lés, coller en plein, maroufler et souder les joints à chaud."
    },
    {
      name: "Fixation de garde-corps",
      description: "Positionner les supports au laser, percer et cheviller, fixer le garde-corps et tester la résistance."
    },
    {
      name: "Installation de volets roulants",
      description: "Fixer le caisson, monter les glissières, raccorder au réseau et configurer la télécommande."
    },
    {
      name: "Réglage de serrure de sécurité",
      description: "Démonter le barillet, lubrifier les mécanismes, réaligner les gâches et tester le verrouillage complet."
    },
    {
      name: "Nettoyage haute pression",
      description: "Utiliser un nettoyeur haute pression pour décaper les surfaces dures, appliquer un produit antidérapant si nécessaire."
    },
    {
      name: "Révision de pompe à chaleur",
      description: "Vérifier les pressions, nettoyer les filtres, tester le fluide frigorigène et assurer la conformité du groupe."
    },
    {
      name: "Test d'étanchéité aux gaz",
      description: "Boucher les extrémités du réseau, injecter du gaz traceur, détecter toute fuite et consigner les résultats."
    },
    {
      name: "Réparations de fissures murales",
      description: "Ouvrir les fissures, injecter une résine de scellement, appliquer un enduit de finition et repeindre."
    },
    {
      name: "Montage de cloison sèche",
      description: "Installer les rails, positionner les plaques BA13, visser, jointer et préparer à la peinture."
    },
    {
      name: "Traitement anti-humidité",
      description: "Décaper la surface touchée, injecter un produit hydrofuge, poser une membrane étanche et ventiler."
    },
    {
      name: "Pose de gouttière en zinc",
      description: "Fixer les crochets, assembler les éléments en zinc par soudure à l’étain, contrôler l’écoulement."
    },
    {
      name: "Démontage de cloison",
      description: "Sécuriser la zone, retirer proprement les plaques, démonter l’ossature métallique et évacuer les gravats."
    },
    {
      name: "Isolation des combles",
      description: "Dérouler l’isolant, couvrir avec pare-vapeur, assurer l’étanchéité des raccords et vérifier les ponts thermiques."
    },
    {
      name: "Pose de dalle PVC clipsable",
      description: "Préparer le sol, clipser les dalles sans colle, découper les rives et poser les plinthes."
    },
    {
      name: "Calfeutrage de fenêtres",
      description: "Retirer les anciens joints, nettoyer les rebords, poser un joint silicone neuf et lisser avec spatule."
    },
    {
      name: "Pose d'escalier en kit",
      description: "Assembler les éléments selon notice, fixer solidement au plancher et sécuriser avec garde-corps."
    },
    {
      name: "Peinture de façade extérieure",
      description: "Laver à haute pression, réparer les fissures, appliquer une couche d’accroche puis deux couches de peinture siloxane."
    },
  ];

  const problemTemplates = [
    {
      title: "Fuite d'eau au niveau du 2ème étage",
      description: "Une fuite d'eau importante a été détectée dans le couloir, nécessitant une intervention urgente pour éviter dégâts des plafonds."
    },
    {
      title: "Panne générale d'électricité",
      description: "L'ensemble du tableau électrique a sauté ce matin après un orage, plongeant tous les étages dans le noir."
    },
    {
      title: "Carrelage fissuré dans la cuisine",
      description: "Plusieurs carreaux sont fissurés suite à un choc, créant un risque de coupures et d’infiltration d’humidité."
    },
    {
      title: "Peinture écaillée dans le salon",
      description: "La peinture commence à s’écailler après des infiltrations d’humidité, donnant un aspect négligé au mur principal."
    },
    {
      title: "Tuiles manquantes sur le toit",
      description: "Des tuiles se sont envolées avec le dernier coup de vent, laissant apparaître la sous-toiture à nu."
    },
    {
      title: "Fenêtre qui ferme mal",
      description: "La poignée est désalignée, ce qui empêche une fermeture hermétique, causant des courants d'air et pertes de chaleur."
    },
    {
      title: "Serrure défectueuse",
      description: "La serrure principale coince, rendant difficile l’ouverture depuis l’extérieur, surtout par temps froid."
    },
    {
      title: "Prise électrique en court-circuit",
      description: "Une étincelle a été observée sur la prise de la salle à manger, provoquant une coupure momentanée du réseau."
    },
    {
      title: "Moisissure au plafond de la salle de bain",
      description: "Des taches sombres se forment en permanence malgré l’aération, indiquant un problème d’humidité chronique."
    },
    {
      title: "Chauffage central en panne",
      description: "Les radiateurs restent froids dans tout l’immeuble malgré la mise en route du chauffage collectif."
    },
    {
      title: "Tâches d'humidité dans le garage",
      description: "Une humidité ascensionnelle remonte le long des murs, détériorant la peinture."
    },
    {
      title: "Ventilation bruyante",
      description: "Le système de VMC émet un sifflement permanent, audible depuis les pièces principales."
    },
    {
      title: "Portail automatique bloqué",
      description: "Le portail motorisé ne répond plus à la commande à distance ni à l'ouverture manuelle."
    },
    {
      title: "Fissure sur le mur porteur",
      description: "Une fissure verticale de plus de 5 mm est visible, signalée comme potentiellement structurelle par l'expert."
    },
    {
      title: "Luminaire qui ne s’allume plus",
      description: "Malgré le remplacement de l’ampoule, le plafonnier ne fonctionne toujours pas."
    },
    {
      title: "Odeur persistante dans le local technique",
      description: "Une odeur de brûlé émane du tableau électrique, pouvant indiquer une surchauffe ou court-circuit latent."
    },
    {
      title: "Escalier extérieur glissant",
      description: "Les marches deviennent dangereusement glissantes après la pluie, sans traitement antidérapant."
    },
    {
      title: "Caniveau bouché",
      description: "Le caniveau du parking ne draine plus correctement, provoquant des flaques persistantes."
    },
    {
      title: "Fuite sous l’évier",
      description: "Une flaque d’eau apparaît chaque matin sous l’évier malgré le serrage des raccords."
    },
    {
      title: "Rideau métallique bloqué",
      description: "Impossible de lever le rideau de la boutique ce matin, même en mode manuel."
    },
    {
      title: "Infiltration autour de la cheminée",
      description: "Lors des pluies, l’eau s’infiltre par les joints du conduit de cheminée, détériorant le plafond."
    },
    {
      title: "Grille de ventilation manquante",
      description: "La grille en façade est tombée, exposant le conduit directement à l’extérieur."
    },
    {
      title: "Détecteur de fumée défectueux",
      description: "Il sonne aléatoirement sans raison, gênant les résidents et nécessitant un remplacement."
    },
    {
      title: "Évier bouché",
      description: "L'eau met plusieurs minutes à s'évacuer, même après tentative de débouchage manuel."
    },
    {
      title: "Radiateur qui fuit",
      description: "Une fuite goutte à goutte persiste au niveau du robinet thermostatique."
    },
    {
      title: "Gaine technique ouverte",
      description: "La trappe d’accès à la gaine technique n’est plus fixée, posant un risque d’accident."
    },
    {
      title: "Porte d’entrée qui frotte",
      description: "Elle frotte fortement contre le sol depuis quelques semaines, rendant l’ouverture difficile."
    },
    {
      title: "Revêtement décollé",
      description: "Le revêtement mural de la cage d’escalier se décolle à plusieurs endroits."
    },
    {
      title: "Carrelage glissant dans les sanitaires",
      description: "Les carreaux deviennent dangereux après nettoyage, un traitement antidérapant est requis."
    },
    {
      title: "Trappe de désenfumage bloquée",
      description: "Elle reste en position fermée malgré l’essai manuel via la commande murale."
    },
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

  const checklistTemplates = [
    "Inspecter la zone affectée",
    "Prendre des photos avant intervention",
    "Commander les pièces nécessaires",
    "Planifier l’intervention",
    "Valider la conformité après réparation",
    "Mettre à jour la documentation",
    "Informer le résident",
    "Vérifier le fonctionnement en conditions réelles",
    "Nettoyer le chantier après travaux",
    "Tester en mode hors charge",
    "Contrôler les branchements électriques",
    "Mesurer la pression hydraulique",
    "Vérifier l’absence de fuites",
    "Analyser le rapport d’anomalie",
    "S’assurer du respect des normes",
    "Renseigner le registre de maintenance",
    "Faire signer par le responsable",
    "Programmer la prochaine visite",
    "Évaluer le coût des fournitures",
    "Vérifier la qualité de la peinture",
    "Contrôler le serrage des fixations",
    "Réaliser un essai fonctionnel",
    "Mettre en place une signalisation de sécurité",
    "Confirmer la remise en service",
    "Archiver les bons de commande",
    "Établir un compte-rendu photo",
    "Informer l’équipe technique",
    "Planifier l’aération post-travaux",
    "Documenter les éventuelles réserves",
    "Vérifier l’intégrité des conduits",
    "Nettoyer les canalisations",
    "Tester le fonctionnement en charge",
    "Vérifier la tension des ressorts",
    "Mettre à jour le planning d’intervention",
    "Archiver la preuve de conformité",
    "Informer la direction",
    "Réaliser un debriefing avec l’équipe",
    "Mettre à jour le tableau de bord",
    "Envoyer le rapport au client",
    "Planifier la formation sur l’équipement",
  ];


  const priorities = ["Urgent", "Important", "Moyen", "Faible"];

  // 1) rôles
  const roleNames = ['client', 'artisan', 'moderator', 'admin'];
  await Role.bulkCreate(roleNames.map((name, idx) => ({ id: idx + 1, name })));

  // 2) utilisateurs
  const users = [{
      firstname: "Admin",
      name: "Test",
      email: "admin@gmail.com",
      job: ["admin"],
      avatar: faker.image.avatar(),
      password: "$2a$08$36NBre.ckxhWoQpVNA1AROClrqTQpLgWIiD1IqtoXYmvA704rtOc.", // Azerty123
    },
    {
      firstname: "Moderator",
      name: "Test",
      email: "moderator@gmail.com",
      job: ["moderator"],
      avatar: faker.image.avatar(),
      password: "$2a$08$36NBre.ckxhWoQpVNA1AROClrqTQpLgWIiD1IqtoXYmvA704rtOc.", // Azerty123
    },
    {
      firstname: "Artisan",
      name: "Test",
      email: "artisan@gmail.com",
      job: ["artisan"],
      avatar: faker.image.avatar(),
      password: "$2a$08$36NBre.ckxhWoQpVNA1AROClrqTQpLgWIiD1IqtoXYmvA704rtOc.", // Azerty123
    },
    {
      firstname: "Client",
      name: "Test",
      email: "client@gmail.com",
      job: ["PDG"],
      avatar: faker.image.avatar(),
      password: "$2a$08$36NBre.ckxhWoQpVNA1AROClrqTQpLgWIiD1IqtoXYmvA704rtOc.", // Azerty123
    },
  ];
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
    const roleId = user.email === "client@gmail.com"
      ? 1 : user.email === "artisan@gmail.com" 
      ? 2 : user.email === "moderator@gmail.com"
      ? 3 : user.email === "admin@gmail.com"
      ? 4 : faker.number.int({ min: 1, max: 3 });
    await user.setRoles([await Role.findByPk(roleId)]);
  }

  // Get all users who have the "artisan" role
  const artisanRole = await Role.findOne({ where: { name: 'artisan' } });
  const artisanUsers = artisanRole
    ? await artisanRole.getUsers({ attributes: ['id'] })
    : [];

  const clientRole = await Role.findOne({ where: { name: 'client' } });
  const clientUsers = clientRole
    ? await clientRole.getUsers({ attributes: ['id'] })
    : [];

  // 3) chantiers / phases / tâches / plannings
  for (let i = 0; i < 5; i++) {
    const chantier = await Chantier.create({
      title: faker.helpers.arrayElement(chantierNames),
      address: faker.location.streetAddress(),
      start: faker.date.past({ years: 1 }),
      end: faker.date.future({ years: 1 }),
      images: Array.from({ length: 3 }, () =>
        `https://picsum.photos/seed/${faker.string.uuid()}/800/600`
      ),
      clientId: faker.helpers.arrayElement(clientUsers).id,
    });

    for (let p = 0; p < faker.number.int({ min: 2, max: 4 }); p++) {
      const phase = await Phase.create({
        name: faker.helpers.arrayElement(phaseNames),
        chantierId: chantier.id,
      });

      for (let t = 0; t < faker.number.int({ min: 2, max: 6 }); t++) {
        const usedDates = new Set();

        const { name, description } = faker.helpers.arrayElement(taskTemplates);
        const isDone = Math.random() <= 0.3;

        const task = await Task.create({
          name,
          description,
          priority: faker.helpers.arrayElement(priorities),
          done: isDone,
          dueDate: Math.random() <= 0.3 ? faker.date.past() : faker.date.future(),
          doneDate: isDone ? faker.date.recent() : null,
          images: isDone ? Array.from({ length: 3 }, () =>
            `https://picsum.photos/seed/${faker.string.uuid()}/800/600`
          ): [],
          phaseId: phase.id,
        });

        const howManyChecks = faker.number.int({ min: 4, max: 8 })
        const picks = faker.helpers.arrayElements(checklistTemplates, howManyChecks)
        for (const itemName of picks) {
          await Checklist.create({
            name: itemName,
            done: false,
            taskId: task.id,
          })
        }

        const assignmentsToCreate = Math.random() < 0.2 ? 0 : faker.number.int({ min: 35, max: 45 });
        let createdAssignments = 0;

        while (createdAssignments < assignmentsToCreate && usedDates.size < 22) {
          const dayOffset = task.done ? faker.number.int({ min: -61, max: -1 }) : faker.number.int({ min: 0, max: 60 });
          const baseDate = new Date();
          baseDate.setDate(baseDate.getDate() + dayOffset);

          const dayOfWeek = baseDate.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) continue;

          const dateKey = baseDate.toISOString().split('T')[0];
          if (usedDates.has(dateKey)) continue;

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

  // 4) problèmes / messages
  for (let i = 0; i < 20; i++) {
    const { title, description } = faker.helpers.arrayElement(problemTemplates);
    const problem = await Problem.create({
      title,
      description,
      priority: faker.helpers.arrayElement(priorities),
      chantierId: faker.number.int({ min: 1, max: 5 }),
      phase: faker.helpers.arrayElement(phaseNames),
      task: faker.helpers.arrayElement(taskTemplates).name,
      date: faker.date.recent(),
      status: faker.helpers.arrayElement(["En cours", "Non résolu", "Résolu"]),
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
