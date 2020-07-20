type joinColumns = {
    leftColumn: string,
    rigthColumn: string
}

export class QueryJoinObject {
    constructor(public leftTable: string, public rightTable: string, public joinColumns: joinColumns[]) { }
}