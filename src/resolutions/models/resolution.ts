export interface Resolution {
    id: string,
    resolution_server: string,
    resolution_entity: object,
    conflict_id: string
    resolved_by?: string
    resolved_by_id?: string;
    created_at: Date,
    updated_at: Date,
    deleted_at?: Date
}