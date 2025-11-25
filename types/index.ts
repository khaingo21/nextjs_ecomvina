// This file defines TypeScript types and interfaces used throughout the application.

export interface Order {
    id: string;
    status: string;
    trackingNumber: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderLookupResponse {
    success: boolean;
    order?: Order;
    message?: string;
}

export interface ApiError {
    status: number;
    message: string;
}