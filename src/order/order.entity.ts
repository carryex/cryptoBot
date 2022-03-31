import { Pull } from 'src/pull/entities/pull.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderType {
  PULL = 'PULL',
  URGENT = 'URGENT',
  TOCRYPTO = 'TOCRYPTO',
}

export enum OrderStatus {
  NEW = 'NEW',
  CANCELED = 'CANCELED',
  COLLECTED = 'COLLECTED',
  CRYPTO_RECEIVED = 'CRYPTO_RECEIVED',
  WAITING_CRYPTO = 'WAITING_CRYPTO',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: false })
  public chatId: number;

  @Column({ nullable: false })
  public wallet: string;

  @Column({ nullable: false })
  public amount: number;

  @ManyToOne(() => Pull, (pull) => pull.orders)
  pull: Pull;

  @Column({
    type: 'enum',
    enum: OrderType,
    default: OrderType.PULL,
    nullable: false,
  })
  public type: OrderType;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.NEW,
    nullable: false,
  })
  public status: OrderStatus;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  public updatedAt: Date;
}
// received money
