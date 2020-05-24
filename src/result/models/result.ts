export interface Result {
    id: string,
    result_server: string,
    result_entity: string,
    conflict_id: string
    resolved_by?: string
    resolved_by_id?: string;
    created_at: Date,
    updated_at: Date,
    deleted_at?: Date
}