import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { RecoveryCode } from "../recovery.codes/recovery.code.entity";
import { Device } from "../devices/device.entity";

@Entity("User")
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

  @OneToOne(() => RecoveryCode, (r) => r.user)
  recoveryCode: RecoveryCode;

  @OneToMany(() => Device, (d) => d.user)
  devices: Device[];
}
