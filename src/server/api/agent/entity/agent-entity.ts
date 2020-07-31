import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Length, MaxLength } from 'class-validator';

/**
 * Entities
 */
import { Issue } from '../../issue/entity/issue-entity';
import { AgentStatus } from './agent-status-entity';

@Entity()
export class Agent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @Length(4, 100)
  name: string;

  @Column({ length: 255, unique: true })
  @MaxLength(255)
  email: string;

  @Column({
    type: 'enum',
    enum: AgentStatus,
    default: AgentStatus.AVAILABLE,
  })
  status: AgentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Issue, (issue: Issue) => issue.agent)
  issueList: Issue[];
}
