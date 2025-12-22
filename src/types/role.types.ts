export enum Role {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    AGENT = "AGENT",
}

export interface UserRole {
    role: Role;
}