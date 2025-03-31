import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tb_user' })
export class UserEntity {

    @PrimaryGeneratedColumn()
    id_user: number;

    @IsNotEmpty()
    @Column({ type: 'bigint' })
    id_user_type: number;

    @IsNotEmpty()
    @Column({ type: 'bigint' })
    id_type_contract: number;

    @IsNotEmpty()
    @Column({ length: 500 })
    name: string;

    @IsNotEmpty()
    @Column({ length: 500 })
    name_fantasy: string;

    @Column({ type: 'smallint' })
    flg_business: number;

    @IsNotEmpty()
    @Column({ length: 50 })
    cpf_cnpj: string;

    @IsNotEmpty()
    @Column({ length: 150 })
    municipal_registration: string;

    @IsNotEmpty()
    @Column({ length: 150 })
    estadual_registration: string;

    @IsNotEmpty()
    @Column({ length: 50 })
    identity: string;

    @IsNotEmpty()
    @Column({ length: 50 })
    identity_expeditor: string;

    @IsNotEmpty()
    @Column({ type: 'datetime' })
    identity_date_expeditor: Date;

    @IsNotEmpty()
    @Column({ length: 50 })
    gender: string;

    @IsNotEmpty()
    @Column({ type: 'datetime' })
    date_birth: Date;

    @IsNotEmpty()
    @Column({ length: 50 })
    nationality: string;

    @Column({ type: 'smallint' })
    flg_status: number;

    @Column({ type: 'smallint' })
    flg_deleted: number;

    @Column({ type: 'date' })
    dt_insert: Date;

    @Column({ type: 'date' })
    dt_update: Date;

    @Column({ type: 'bigint' })
    id_login_update: number;

    @Column({ type: 'bigint' })
    id_login_insert: number;

}