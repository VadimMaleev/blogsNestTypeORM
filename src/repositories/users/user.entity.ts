import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column({ nullable: true })
  confirmationCode: string;

  @Column({ type: "timestamp with time zone", nullable: true })
  codeExpirationDate: Date;

  @Column()
  isConfirmed: boolean;

  @Column()
  isBanned: boolean;

  @Column({ type: "timestamp with time zone", nullable: true })
  banDate: Date;

  @Column({ nullable: true })
  banReason: string;
}
