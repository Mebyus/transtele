export interface Base {
    side: 'server' | 'client';
    code: number;
    cause: string;
    description: string;
}

export interface ServerSide extends Base {
    side: 'server';
}

export interface ClientSide extends Base {
    side: 'client';
}
