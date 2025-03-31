export interface JwtPayload {
    data?: {
        id_user: number;
        name: string;
        id_type_user: number;
        id_user_father: number;
        username: string;
    }

    id_user: number;
    name: string;
    id_type_user: number;
    id_user_father: number;
    username: string;
}