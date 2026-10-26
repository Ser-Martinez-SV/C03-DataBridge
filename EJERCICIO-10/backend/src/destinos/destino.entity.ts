import { Column,Entity,PrimaryGeneratedColumn } from 'typeorm';

export type PrioridadDestino='alta'|'media'|'baja';

@Entity('destinos')
export class Destino {
 @PrimaryGeneratedColumn() id:number;
 @Column() ciudad:string;
 @Column() pais:string;
 @Column() descripcion:string;
 @Column({type:'varchar',default:'media'}) prioridad:PrioridadDestino;
 @Column({default:false}) visitado:boolean;
}