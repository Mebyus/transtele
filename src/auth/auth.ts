import * as crypto from 'crypto';
import * as userQuery from '../database/user';
import * as dbtype from '../types/server/database';
import * as payload from '../types/shared/client-payload';

export function verify(login: string, password: string): Promise<dbtype.User | null> {
    return userQuery.getByLogin(login).then((user: dbtype.User | null): dbtype.User | null => {
        if (user && compareHashAndPassword(user.passwordHash, password)) {
            return user;
        } else {
            return null;
        }
    });
}

export function addUser(user: payload.NewUser): Promise<boolean> {
    let rejectReason: string | null = null;
    if (!user.password) {
        rejectReason = 'no password was provided';
    } else if (!user.confirm) {
        rejectReason = 'no password confirmation was provided';
    } else if (user.password !== user.confirm) {
        rejectReason = "passwords doesn't match";
    }
    if (rejectReason) {
        return new Promise((resolve, reject) => {
            reject(rejectReason);
        });
    }
    return userQuery.insert({
        login: user.login,
        email: user.email,
        passwordHash: generateHash(user.password),
    });
}

function compareHashAndPassword(hashed: string, password: string): boolean {
    // Without a secret
    const hash = crypto.createHash('sha512');

    // Or use HMAC with a secret like this
    // const hash = crypto.createHmac('sha512', 'your random secret')

    return hash.update(password).digest('hex') === hashed;
}

export function generateHash(password: string): string {
    // Without a secret
    const hash = crypto.createHash('sha512');

    // Or use HMAC with a secret like this
    // const hash = crypto.createHmac('sha512', 'your random secret')

    return hash.update(password).digest('hex');
}
