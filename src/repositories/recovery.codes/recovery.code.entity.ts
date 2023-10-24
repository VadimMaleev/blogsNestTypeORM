import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity("RecoveryCode")
export class RecoveryCode {
  @Column()
  code: string;

  @Column({ type: "timestamp with time zone", nullable: true })
  codeExpirationDate: Date;

  @PrimaryColumn({ type: "uuid" })
  userId: string;

  @OneToOne(() => User, (u) => u.recoveryCode)
  @JoinColumn()
  user: User;
}
