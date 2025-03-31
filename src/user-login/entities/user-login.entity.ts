import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tb_user_login' })
export class UserLoginEntity {

    @PrimaryGeneratedColumn()
    id_user_login: number;

    @IsNotEmpty()
    @Column({ type: 'bigint' })
    id_user: number;

    @IsNotEmpty()
    @Column({ length: 150 })
    username: string;

    @IsNotEmpty()
    @Column({ length: 150 })
    password: string;

    @IsNotEmpty()
    @Column({ length: 150 })
    email: string;

    @IsNotEmpty()
    @Column({ type: 'datetime' })
    dt_last_login: Date;

    @Column({ type: 'smallint' })
    flg_update_password: number;

    @Column({ type: 'smallint' })
    flg_status: number;

    @Column({ type: 'date' })
    dt_insert: Date;

    @Column({ type: 'date' })
    dt_update: Date;

    @Column({ type: 'bigint' })
    id_login_insert: number;

    @Column({ type: 'bigint' })
    id_login_update: number;
    
}