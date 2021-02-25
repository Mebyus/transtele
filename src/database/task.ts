import * as dbtype from '../types/server/database';
import db from './connection';

const qSelectTaskById = `
    select
        id,
        name,
        created_at,
        description
    from
        "task"
    where
        id = $id`;

export function get(id: number): Promise<dbtype.Task | null> {
    return new Promise((resolve, reject) => {
        db.get(
            qSelectTaskById,
            { id: id },
            (err: Error | null, row: dbtype.Task | undefined): void => {
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

const qSelectTasksByUserId = `
    select
        id,
        name,
        created_at,
        description
    from
        "task"
    where
        fk_user = $id and
        archived <> 1`;

export function getByUserId(id: number): Promise<dbtype.Task[]> {
    return new Promise((resolve, reject) => {
        db.all(qSelectTasksByUserId, { id: id }, (err: Error | null, rows: dbtype.Task[]): void => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

const qInsertTaskForUserId = `
    insert into "task" (
        fk_user,
        name,
        description
    ) values (
        $userId,
        $name,
        $description
    )`;

export function insert(task: dbtype.UnsavedTask, id: number): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(
            qInsertTaskForUserId,
            { userid: id, name: task.name, description: task.description },
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

const qArchiveTaskById = `
    update "task" set
        archived = 1
    where id = $id`;

export function archive(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(qArchiveTaskById, { id: id }, (err: Error | null): void => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

const qUpdateTaskById = `
    update "task" set
        name = $name,
        description = $description
    where
        id = $id`;

export function update(task: dbtype.Task): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(qUpdateTaskById, task, (err: Error | null): void => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
