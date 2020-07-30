import { Like } from 'typeorm';

/**
 * Constants
 */
import { paginationConst } from '@/constants/pagination';

/**
 * Interfaces
 */
import { IPagination } from '@/interfaces/pagination.interface';
import { IPaginationQuery } from '@/interfaces/pagination-query.interface';
import { Validation } from '@/utils/Validation';

export class ManagePagination {
  /* Pagination object */
  private pagination: IPagination = {};

  /* Query constraint object */
  private query: IPaginationQuery = {
    where: {},
    skip: 0,
    take: 0,
    order: {},
  };

  constructor(query: any, extraWhere = {}) {
    this.init(query, extraWhere);
  }

  /**
   * Initialize pagination
   * @param query: Request query params
   * @param extraWhere: Extra where constraints
   */
  private init(query: any, extraWhere: any): void {
    this.preparePagination(query);
    this.prepareLimitConstraint();
    this.mergeExtraWhere(extraWhere);
    this.prepareSearch();
    this.prepareSort();
  }

  /**
   * Prepare pagination object
   * @param query: Request query params
   */
  private preparePagination(query: any): void {
    this.pagination.page = +(query.page ? query.page : 1);
    this.pagination.search = query.search ? Validation.validateQuotes(query.search) : '';
    this.pagination.field = query.field ? query.field : '';
    this.pagination.sort = query.sort ? query.sort.toUpperCase() : 'ASC';
    this.pagination.sortField = query.sortField ? query.sortField : '';
  }

  /**
   * Prepare limit constraint values
   */
  private prepareLimitConstraint(): void {
    this.query.skip = (this.pagination.page - 1) * <number>paginationConst.LIMIT;
    this.query.take = this.query.skip + <number>paginationConst.LIMIT;
  }

  /**
   * Merge extra where constraint
   * @param extraWhere: Extra where constraints
   */
  private mergeExtraWhere(extraWhere: any): void {
    this.query.where = Object.assign(this.query.where, extraWhere);
  }

  /**
   * Prepare search
   */
  private prepareSearch(): void {
    if (this.pagination.field && this.pagination.search && !this.query.where.hasOwnProperty(this.pagination.field)) {
      this.query.where[this.pagination.field] = Like(`%${this.pagination.search}%`);
    }
  }

  /**
   * Prepare sort constraint
   */
  private prepareSort(): void {
    if (this.pagination.sortField && this.pagination.sort) {
      this.query.order[this.pagination.sortField] = this.pagination.sort;
    }
  }

  /**
   * Get query pagination
   */
  getQuery(): IPaginationQuery {
    return this.query;
  }

  /**
   * Get field pagination
   */
  getField(): string {
    return this.pagination.field;
  }

  /**
   * Get search pagination
   */
  getSearch(): string {
    return this.pagination.search;
  }

  /**
   * Get sortField pagination
   */
  getSortField(): string {
    return this.pagination.sortField;
  }

  /**
   * Get sort pagination
   */
  getSort(): string {
    return this.pagination.sort;
  }
}
