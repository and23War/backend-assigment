import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Length, MaxLength } from 'class-validator';

/**
 * Entities
 */
import { IssueStatus } from './issue-status-entity';
import { Agent } from '../../agent/entity/agent-entity';

@Index('fk_Issue_Agent1_idx', ['agentId'], {})
@Entity()
export class Issue extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  @Length(4, 150)
  nameUser: string;

  @Column({ length: 255 })
  @MaxLength(255)
  emailUser: string;

  @Column({ length: 255 })
  @Length(4, 255)
  description: string;

  @Column({
    type: 'enum',
    enum: IssueStatus,
    default: IssueStatus.OPEN,
  })
  status: IssueStatus;

  @Column({ nullable: true, default: null })
  agentId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Agent, (agent: Agent) => agent.issueList)
  @JoinColumn([{ name: 'agentId', referencedColumnName: 'id' }])
  agent: Agent;
}
