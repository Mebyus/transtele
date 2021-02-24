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
            { id: id },
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
    )`;

export function insert(user: dbtype.UnsavedUser): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(qInsertUser, user, (err: Error | null): void => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

const qUpdateUserById = `
    update "user" set
        email = $email,
        password_hash = $passwordHash
    where id = $id`;

export function update(user: dbtype.User): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(qUpdateUserById, user, (err: Error | null): void => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
