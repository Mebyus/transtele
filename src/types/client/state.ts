import * as error from '../shared/error';
import * as basic from './basic';

export interface App {
    id: number;
    tasks: {
        list: basic.Task[];
        selected: {
            id: number;
            index: number;
        };
    };
    user: basic.User;
    connection: boolean; // true if connection is open
    errors: {
        pending: error.Base[];
    };
}
