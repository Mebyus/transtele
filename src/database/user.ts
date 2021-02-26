import * as dbtype from '../types/server/database';
import db from './connection';

const qSelectUserById = `
    select
        id,
        login,
        email,
        password_hash
    from
        "user"
    where
        id = $id`;

export function get(id: number): Promise<dbtype.User | null> {
    return new Promise((resolve, reject) => {
        db.get(
            qSelectUserById,
            { $id: id },
            (err: Error | null, row: dbtype.User | undefined): void => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(row);
                } else {
                    resolve(null);
                }
            }
        );
    });
}

const qSelectUserByLogin = `
    select
        id,
        login,
        email,
        password_hash as passwordHash
    from
        "user"
    where
        login = $login`;

export function getByLogin(login: string): Promise<dbtype.User | null> {
    return new Promise((resolve, reject) => {
        db.get(
            qSelectUserByLogin,
            { $login: login },
            (err: Error | null, row: dbtype.User | undefined): void => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(row);
                } else {
                    resolve(null);
                }
            }
        );
    });
}

const qInsertUser = `
    insert into "user" (
        login,
        email,
        password_hash
    ) values (
        $login,
        $email,
        $passwordHash
    )
    on conflict (login) do nothing`;

/**
 * Returns promise with a boolean value. If the value is true, then
 * insert was successful, otherwise database query violates login
 * attribute unique constraint
 * @param user
 */
export function insert(user: dbtype.UnsavedUser): Promise<boolean> {
    return new Promise((resolve, reject) => {
        db.run(
            qInsertUser,
            {
                $login: user.login,
                $email: user.email,
                $passwordHash: user.passwordHash,
            },
            function (err: Error | null): void {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes !== 0);
                }
            }
        );
    });
}

const qUpdateUserById = `
    update "user" set
        email = $email,
        password_hash = $passwordHash
    where id = $id`;

export function update(user: dbtype.User): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(
            qUpdateUserById,
            { $id: user.id, $passwordHash: user.passwordHash, $email: user.email },
            (err: Error | null): void => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}
