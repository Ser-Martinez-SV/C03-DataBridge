import { PrioridadDestino } from './destino.entity';

export class CreateDestinoDto {
 ciudad:string;
 pais:string;
 descripcion:string;
 prioridad?:PrioridadDestino;
 visitado?:boolean;
}