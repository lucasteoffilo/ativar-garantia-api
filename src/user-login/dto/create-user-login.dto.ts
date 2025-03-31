export class CreateUserLoginDto {
    id_user_login: number;

    id_user: number;

    username: string;

    password: string;

    email: string;

    dt_last_login: Date;

    flg_update_password: number;

    flg_status: number;

    dt_insert: Date;

    dt_update: Date;

    id_login_insert: number;

    id_login_update: number;
}
