// loadFakeData.js
require('dotenv').config();
const { faker } = require('@faker-js/faker');
const db = require('./app/models');
const {
    User,
    Role,
    Chantier,
    Phase,
    Task,
    TaskPlanning,
    Problem,
    ProblemMessage,
    sequelize
} = db;

module.exports = async function loadFakeData() {
    await sequelize.sync({ force: true });

    // 1) roles
    const roleNames = ['user', 'moderator', 'admin'];
    await Role.bulkCreate(
        roleNames.map((name, idx) => ({ id: idx + 1, name }))
    );

    // 2) users
    const users = [{
        firstname: 'Aurélien',
        name: 'Penot',
        email: 'aurelien@gmail.com',
        job: ['PDG'],
        avatar: null,
        password: "$2a$08$36NBre.ckxhWoQpVNA1AROClrqTQpLgWIiD1IqtoXYmvA704rtOc." // Azerty123
    }];
    for (let i = 1; i <= 100; i++) {
        users.push({
            firstname: faker.person.firstName(),
            name: faker.person.lastName(),
            email: faker.internet.email(),
            job: [faker.person.jobTitle()],
            avatar: faker.image.avatar(),
            password: "$2a$08$36NBre.ckxhWoQpVNA1AROClrqTQpLgWIiD1IqtoXYmvA704rtOc." //Azerty123
        });
    }
    await User.bulkCreate(users);
    // assign roles
    for (const user of await User.findAll()) {
        if (user.email === 'aurelien@gmail.com') {
            const adminRole = await Role.findOne({ where: { name: 'admin' } });
            await user.setRoles([adminRole]);
        } else {
            // random role
            const roleId = faker.number.int({ min: 1, max: 3 });
            const role = await Role.findByPk(roleId);
            await user.setRoles([role]);
        }
    }

    // 3) chantiers
    let phaseId = 1, taskId = 1, tpId = 1;
    for (let cid = 1; cid <= 50; cid++) {
        const chantier = await Chantier.create({
            title: faker.company.name(),
            address: faker.location.streetAddress(),
            start: faker.date.past(1),
            end: faker.date.future(1),
            progress: faker.number.int(100),
            images: [],
            intervenants: [],
            clientId: faker.number.int({ min: 1, max: 100 })
        });
        for (let p = 0; p < 3; p++) {
            const phase = await Phase.create({
                id: phaseId++,
                name: `Phase ${p + 1}: ${faker.commerce.department()}`,
                progress: faker.number.int(100),
                chantierId: chantier.id
            });
            for (let t = 0; t < 5; t++) {
                const task = await Task.create({
                    id: taskId++,
                    name: faker.hacker.phrase(),
                    done: faker.datatype.boolean(),
                    dueDate: faker.date.future(),
                    doneDate: faker.datatype.boolean() ? faker.date.recent() : null,
                    images: [],
                    phaseId: phase.id
                });
                // plannings
                const plans = faker.number.int({ min: 0, max: 3 });
                for (let k = 0; k < plans; k++) {
                    await TaskPlanning.create({
                        id: tpId++,
                        startDate: faker.date.between({ from: chantier.start, to: chantier.end }),
                        endDate: faker.date.between({ from: chantier.start, to: chantier.end }),
                        taskId: task.id
                    });
                }
            }
        }
    }

    // 4) problems
    let msgId = 1;
    for (let i = 1; i <= 200; i++) {
        const problem = await Problem.create({
            title: faker.lorem.sentence(),
            urgency: faker.helpers.arrayElement(['Urgent', 'Moyen', 'Faible']),
            chantier: faker.company.name(),
            phase: `Phase ${faker.number.int({ min: 1, max: 3 })}`,
            task: `Task ${faker.number.int({ min: 1, max: 20 })}`,
            date: faker.date.recent(),
            status: faker.helpers.arrayElement(['En cours', 'Non résolu', 'Résolu']),
            description: faker.lorem.paragraph(),
            images: [],
            userId: faker.number.int({ min: 1, max: 100 })
        });
        const count = faker.number.int({ min: 0, max: 5 });
        for (let m = 0; m < count; m++) {
            await ProblemMessage.create({
                id: msgId++,
                date: faker.date.recent(),
                content: faker.lorem.sentence(),
                problemId: problem.id,
                senderId: faker.number.int({ min: 1, max: 100 })
            });
        }
    }

    console.log('✅ Faker data seeding complete');
};