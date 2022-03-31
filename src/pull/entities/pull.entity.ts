import { Order } from 'src/order/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PullStatus {
  FORMERING = 'FORMERING',
  IS_REPLENISHED = 'IS_REPLENISHED',
}

const DEFAULT_PULL_LIMIT = 20000;

@Entity()
export class Pull {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: false, default: 0 })
  public amount: number;

  @Column({ nullable: false, default: DEFAULT_PULL_LIMIT })
  public limit: number;

  @OneToMany(() => Order, (order) => order.pull)
  orders: Order[];

  @Column({
    type: 'enum',
    enum: PullStatus,
    default: PullStatus.FORMERING,
    nullable: false,
  })
  public status: PullStatus;

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
