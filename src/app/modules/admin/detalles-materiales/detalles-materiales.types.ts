export interface DetallesMaterialesDtos {
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

export interface DetallesMaterialesPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface DetallesMaterialesSelect {
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