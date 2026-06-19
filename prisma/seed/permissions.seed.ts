import { prisma } from "./prisma.seed.client";

export const seedPermissions = async () =>{
    const permissionsData = [
        // system 
        'role:manage',
        'permission:manage',
        'user:manage',

        // fleet 
        'fleet:create',
        'fleet:read',
        'fleet:update',
        'fleet:delete',

        // vehicle
        'vehicle:create',
        'vehicle:read',
        'vehicle:update',
        'vehicle:delete',
        'vehicle:track',
        'vehicle:view_history',
        'vehicle:parking_mode',
        'vehicle:driving_mode',
        'vehicle:engine_lock',
        'vehicle:engine_unlock',

        // driver
        'driver:create',
        'driver:read',
        'driver:update',
        'driver:assign',
        'driver:remove',

        //caretaker        'caretaker:create',
        'caretaker:create',
        'caretaker:read',
        'caretaker:assign',
        'caretaker:remove',

        // alerts

        'alert:read',
        'alert:receive',
        'alert:configure',
    ];

    for(const action of permissionsData){
        await prisma.permission.upsert({
            where: { action },
            update: {},
            create: { action },
        });
    }
   console.log('Permissions seeded successfully');

}