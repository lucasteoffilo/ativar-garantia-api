import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: 'tb_user_service' })
export class UserServiceEntity {

    @PrimaryGeneratedColumn()
    id_user_service: number;

    @IsNotEmpty()
    @Column({ type: 'bigint' })
    id_user: number;

    @IsNotEmpty()
    @Column({ type: 'bigint' })
    id_type_order_service: number;

    @Column({ type: 'smallint', default: 1 })
    flg_status: number;

    @Column({ type: 'smallint', default: 0 })
    flg_deleted: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    dt_insert: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    dt_update: Date;

    // Chave estrangeira
    @ManyToOne(() => UserEntity, user => user.id_user)
    @JoinColumn({ name: 'id_user' })
    user: UserEntity;

}