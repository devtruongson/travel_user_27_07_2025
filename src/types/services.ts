export interface Motorbike {
    id: number;
    name: string;
    brand: string;
    price: number;
    description?: string;
    unit?: string;
}

export interface Bus {
    id: number;
    name: string;
    route: string;
    price: number;
    description?: string;
    unit?: string;
}

export interface Guide {
    id: number;
    name: string;
    location: string;
    price: number;
    description?: string;
    unit?: string;
}

export interface Hotel {
    id: number;
    hotel_name: string;
    address: string;
    price: number;
    description?: string;
    unit?: string;
}

export type ServiceItem = Motorbike | Bus | Guide | Hotel;
