import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity("Device")
export class Device {
  @PrimaryColumn({ type: "uuid" })
  deviceId: string;

  @Column()
  ip: string;

  @Column()
  title: string;

  @Column({ type: "uuid" })
  userId: string;

  @Column({ type: "timestamp with time zone", nullable: true })
  lastActiveDate: Date;

  @ManyToOne(() => User, (u) => u.devices)
  @JoinColumn()
  user: User;
}
