export interface ProyectosDtos {
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

export interface ProyectosPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface ProyectosSelect {
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