import {prisma} from "./prisma.seed.client";

export const seedRoles = async () => {
    const rolesData = [
        'SUPER_ADMIN',
        'FLEET_MANAGER',
        'DRIVER',
        'CARETAKER',
    ];

    for(const name of rolesData){
        await prisma.role.upsert({
            where: { name },
            update: {},
            create: { 
                name ,
                description: `${name} role`

            },
        })
    }
      console.log('✅ Roles seeded');

}