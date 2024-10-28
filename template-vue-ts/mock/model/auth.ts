interface UserModel extends Auth.UserInfo {
    token: string
    password: string
}

export const userModel: UserModel[] = [
    {
        token: '__TOKEN_SOYBEAN__',
        userId: 0,
        username: 'Soybean',
        userRole: 'super',
        password: 'soybean123'
    },
    {
        token: '__TOKEN_SUPER__',
        userId: 1,
        username: 'Super',
        userRole: 'super',
        password: 'super123'
    },
    {
        token: '__TOKEN_ADMIN__',
        userId: 2,
        username: 'Admin',
        userRole: 'admin',
        // password: "admin123",
        password: '123456'
    },
    {
        token: '__TOKEN_USER01__',
        userId: 3,
        username: 'User01',
        userRole: 'user',
        password: 'user01123'
    }
]
