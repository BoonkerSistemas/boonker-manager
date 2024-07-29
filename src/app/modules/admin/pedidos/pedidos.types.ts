export interface PedidosDtos {
    id?: number;
    descripcion?: string;
    ncm?: string;
    peso?: string;
    tipo?: string;
    origen?: string;
    fispq?: boolean;
    temperatura?: string;
    estado?: boolean;
}

export interface PedidosPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface PedidosSelect {
    id: number;
    descripcion?: string;
    ncm?: string;
    peso?: string;
    tipo?: string;
    origen?: string;
    fispq?: boolean;
    temperatura?: string;
    estado?: boolean;
    //prueba?: string;
}