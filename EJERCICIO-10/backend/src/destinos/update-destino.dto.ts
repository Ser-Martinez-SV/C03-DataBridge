import { PrioridadDestino } from './destino.entity';

export class UpdateDestinoDto {
 ciudad?:string;
 pais?:string;
 descripcion?:string;
 prioridad?:PrioridadDestino;
 visitado?:boolean;
}