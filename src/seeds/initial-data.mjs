import Joi from "joi";

/**
 *
 * @param {import("knex").Knex} knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    // Deletes ALL existing entries
    await knex("types").del();
    await knex("products").del();
    await knex("client_roles").del();
    await knex("workflows").del();
    await knex("alas_hak").del();
    await knex("clients").del();
    await knex("alas_hak_clients").del();
    // Inserts seed entries

    await knex("types").insert([
        { id: 1, name: "SHM" },
        { id: 2, name: "SHGB" },
        { id: 3, name: "SHGU" },
        { id: 4, name: "SHT" },
        { id: 5, name: "NIB" },
    ]);

    await knex("client_roles").insert([
        { id: 1, name: "PEMBERI_HAK" },
        { id: 2, name: "PENERIMA_HAK" },
        { id: 3, name: "PIHAK_PERSETUJUAN" },
        { id: 4, name: "KUASA_PEMBERI" },
        { id: 5, name: "KUASA_PENERIMA" },
        { id: 6, name: "PEMOHON" },
        { id: 7, name: "SAKSI" },
    ]);

    // const [[{ ROLES }]] = await knex.raw(`
    //         SELECT JSON_ARRAYAGG(JSON_OBJECT(cr.name, cr.id)) as ROLES FROM client_roles as cr
    //     `);
    // const [[{ ROLES }]] = await knex.raw(`
    //         SELECT JSON_OBJECTAGG(name, id) as ROLES FROM client_roles
    //     `);

    const [{ ROLES }] = await knex("client_roles").select(
        knex.raw(`
            JSON_OBJECTAGG(name, id) as ROLES
        `),
    );

    // bulk insert ignore default value
    // because knex normalize the data so the missing column will be null
    [
        {
            id: 1,
            name: "JUAL BELI",
            is_transaction: true,
            type_transaction: "FULL_TRANSFER",
            roles: {
                required: [ROLES.PENERIMA_HAK],
                optional: [
                    ROLES.PIHAK_PERSETUJUAN,
                    ROLES.KUASA_PEMBERI,
                    ROLES.KUASA_PENERIMA,
                ],
                auto: [ROLES.PEMBERI_HAK],
            },
        },
        {
            id: 2,
            name: "WARIS",
            is_transaction: true,
            type_transaction: "PARTIAL_TRANSFER",
            roles: {
                required: [ROLES.PENERIMA_HAK],
                optional: [],
                auto: [ROLES.PEMBERI_HAK],
            },
        },
        {
            id: 3,
            name: "HIBAH",
            is_transaction: true,
            type_transaction: "FULL_TRANSFER",
            roles: {
                required: [ROLES.PENERIMA_HAK],
                optional: [
                    ROLES.PIHAK_PERSETUJUAN,
                    ROLES.KUASA_PEMBERI,
                    ROLES.KUASA_PENERIMA,
                ],
                auto: [ROLES.PEMBERI_HAK],
            },
        },
        {
            id: 4,
            name: "PENDAFTARAN PERTAMA",
            roles: {
                required: [ROLES.PENERIMA_HAK],
                optional: [],
                auto: [],
            },
        },
        {
            id: 5,
            name: "PEMECAHAN",
        },
        { id: 6, name: "GANTI NAMA" },
        { id: 7, name: "ROYA" },
        {
            id: 8,
            name: "PISAH HAK BERSAMA",
            is_transaction: true,
            type_transaction: "RELEASE",
            roles: {
                required: [ROLES.PEMBERI_HAK, ROLES.PENERIMA_HAK],
                optional: [
                    ROLES.PIHAK_PERSETUJUAN,
                    ROLES.KUASA_PEMBERI,
                    ROLES.KUASA_PENERIMA,
                ],
                auto: [],
            },
        },
    ].forEach(async (val) => await knex("products").insert(val));

    await knex("workflows").insert([
        { name: "Validasi Berkas", order: 1, prd_id: 1 },
        {
            name: "Alas Hak - Input Alas Hak",
            order: 2,
            prd_id: 1,
            validation: {
                handler: "alashak",
                fields: Joi.object({
                    ah_id: Joi.number().required(),
                }).describe(),
            },
        },
        {
            name: "CLients - Input Clients",
            order: 3,
            prd_id: 1,
            validation: {
                handler: "clients",
                fields: Joi.object({
                    clients: Joi.array()
                        .items({
                            id: Joi.number().required(),
                            role_id: Joi.number().required(),
                        })
                        .required(),
                }).describe(),
            },
        },
        {
            name: "BPHTB - Survei",
            order: 4,
            prd_id: 1,
            validation: {
                handler: "bphtb",
                fields: Joi.object({
                    tgl_survei: Joi.date().required(),
                    hasil_survei: Joi.number().min(1).required(),
                }).describe(),
            },
        },
        // {
        //     name: "BPHTB - Perintah Bayar",
        //     order: 3,
        //     prd_id: 1,
        //     required_fields: {
        //         total_bayar: {
        //             name: "total_bayar",
        //             type: "number",
        //         },
        //         tgl_perintah_bayar: {
        //             name: "tgl_perintah_bayar",
        //             type: "date",
        //         },
        //     },
        // },
        // { name: "PPH", order: 3, prd_id: 1 },
        // { name: "ZNT", order: 4, prd_id: 1 },
        // { name: "CEKING", order: 5, prd_id: 1 },
        // { name: "Tanda Tangah AJB", order: 6, prd_id: 1 },
        // { name: "Validasi NOTARIS", order: 7, prd_id: 1 },
    ]);

    await knex("alas_hak").insert([
        {
            id: 1,
            no_alas_hak: "03040804100025",
            type_id: 1,
            luas: 100,
            address_code: "13.06.07.2004",
            jor: "Bonjo",
            tgl_alas_hak: "2020-12-12",
            no_surat_ukur: "00030/Panampuang/2020",
            tgl_surat_ukur: "2020-12-11",
        },
        {
            id: 2,
            no_alas_hak: "03040804100393",
            type_id: 1,
            luas: 100,
            address_code: "13.06.07.2006",
            jor: "Cibuak Ameh",
            tgl_alas_hak: "2006-12-12",
            no_surat_ukur: "00224/Pasia/2020",
            tgl_surat_ukur: "2006-12-11",
        },
    ]);

    await knex("clients").insert([
        {
            id: 1,
            first_name: "John",
            last_name: "Doe",
            nik: 1307051212770001,
            nkk: 1307050101010001,
            birth_date: "1977-12-12",
            birth_place: "Duri",
            job_name: "Karyawan Swasta",
            address_code: "13.07.05.2007",
            marriage_status: "kawin",
            gender: "pria",
        },
        {
            id: 2,
            first_name: "Jane",
            last_name: "Doe",
            nik: 1307056908800002,
            nkk: 1307050101010001,
            birth_date: "1980-08-29",
            birth_place: "Duri",
            job_name: "Mengurus Rumah Tangga",
            address_code: "13.07.05.2007",
            marriage_status: "kawin",
            gender: "wanita",
        },
        {
            id: 3,
            first_name: "Mike",
            last_name: "Doe",
            nik: 1307051212950003,
            nkk: 1307050101010001,
            birth_date: "1995-12-12",
            birth_place: "Duri",
            job_name: "Pelajar/Mahasiswa",
            address_code: "13.07.05.2007",
            marriage_status: "kawin",
            gender: "pria",
        },
    ]);

    await knex("alas_hak_clients").insert([
        {
            client_id: 1,
            alas_hak_id: 1,
        },
        {
            client_id: 2,
            alas_hak_id: 1,
        },
        {
            client_id: 2,
            alas_hak_id: 2,
        },
    ]);

    // await knex("cases").insert([
    //     {
    //         id: 1,
    //         ah_id: 1,
    //         prd_id: 1,
    //         status: "DRAFT",
    //     },
    // ]);

    // await knex("case_clients").insert([
    //     {
    //         case_id: 1,
    //         client_id: 1,
    //         roles_id: 1,
    //     },
    //     {
    //         case_id: 1,
    //         client_id: 2,
    //         roles_id: 2,
    //     },
    // ]);
}
