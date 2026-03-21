// {
//   "success": true,
//   "data": {
//     "id": 1,
//     "no_akta": "01",
//     "tahun_akta": "2026",
//     "tgl_akta": "2026-03-03T00:00:00.000Z",
//     "created_at": "2026-03-21T16:59:49.000Z",
//     "updated_at": "2026-03-21T16:59:49.000Z",
//     "proses_id": 1,
//     "produk_id": 1,
//     "no_surat": "001/PPAT-WK/III/2026",
//     "tgl_surat": "2026-03-01T00:00:00.000Z",
//     "status": "DRAFT",
//     "desc": "JUAL BELI",
//     "alas_hak": {
//       "id": 3,
//       "no_alas_hak": "03040804102576",
//       "luas": 125
//     },
//     "clients": []
//   }
// }
/**
 *
 * @param {Array} data
 */
export function destructureData(data) {
    const {
        produk_id,
        desc,
        proses_id,
        no_surat,
        tgl_surat,
        status,
        alas_hak_id,
        no_alas_hak,
        luas,
        client_id,
        first_name,
        last_name,
        roles,
        ...rest
    } = data[0];

    const clients_roles = data.map((row) => {
        const { client_id, first_name, last_name, roles } = row;
        return {
            id: client_id,
            first_name,
            last_name,
            roles,
        };
    });

    return {
        ...rest,
        produk: {
            id: produk_id,
            desc,
        },
        proses_alas_hak: {
            id: proses_id,
            no_surat,
            tgl_surat,
            status,
        },
        alas_hak: {
            id: alas_hak_id,
            no_alas_hak,
            luas,
        },
        clients: clients_roles[0].client_id ? clients_roles : [],
    };
}
