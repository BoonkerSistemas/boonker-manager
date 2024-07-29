export class InsertResultDto {
    identifiers: Identifier[];
    generatedMaps: any[];
    raw: any[];
}

interface Identifier {
    id: number;
}
