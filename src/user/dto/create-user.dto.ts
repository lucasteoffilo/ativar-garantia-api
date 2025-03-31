import { IsNotEmpty } from "class-validator";

export class CreateUserDto {

    id_user: number;

    id_type_user: number;

    id_type_contract: number;

    name: string;

    name_fantasy: string;

    flg_business: number;

    cpf_cnpj: string;

    municipal_registration: string;

    estadual_registration: string;

    identity: string;

    identity_expeditor: string;

    identity_date_expeditor: Date;

    gender: string;

    date_birth: Date;

    nationality: string;
    
    flg_status: number;
    
    dt_insert: Date;

    dt_update: Date;

    id_insert_update: number;

    id_insert_login: number;
}
