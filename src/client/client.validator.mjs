import * as validator from "../../utils/validator.mjs"
const notNullable = [
    "nik", "first_name",
    "birth_date", "birth_place",
    "job_name", "address_code",
    "marriage_status", "gender"

]

const nullable = [
    "last_name", "address", 
]

const numerical = [
    "rt", "rw"
]

export const clientValidation = [
    ...notNullable.map(validator.stringNotNullable),
    ...nullable.map(validator.stringNullable),
    ...numerical.map(validator.numerical),
    validator.isPhoneNumber("phone_number")
]