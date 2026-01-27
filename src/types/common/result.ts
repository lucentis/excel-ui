/**
 * Pattern Result<T, E> pour gestion d'erreurs explicite
 * Inspiré de Rust et fonctionnel programming
 */

/**
 * Type d'erreur de base
 */
export interface ErrorDetails {
    code: string
    message: string
    context?: Record<string, unknown>
  }
  
  /**
   * Résultat success
   */
  export interface Success<T> {
    success: true
    data: T
  }
  
  /**
   * Résultat failure
   */
  export interface Failure<E = ErrorDetails> {
    success: false
    error: E
  }
  
  /**
   * Type Result union
   */
  export type Result<T, E = ErrorDetails> = Success<T> | Failure<E>
  
  /**
   * Helper pour créer un succès
   */
  export const ok = <T>(data: T): Success<T> => ({
    success: true,
    data,
  })
  
  /**
   * Helper pour créer une erreur
   */
  export const err = <E = ErrorDetails>(error: E): Failure<E> => ({
    success: false,
    error,
  })
  
  /**
   * Type guard pour vérifier si c'est un succès
   */
  export const isSuccess = <T, E>(result: Result<T, E>): result is Success<T> => {
    return result.success === true
  }
  
  /**
   * Type guard pour vérifier si c'est une erreur
   */
  export const isFailure = <T, E>(result: Result<T, E>): result is Failure<E> => {
    return result.success === false
  }
  
  /**
   * Codes d'erreur communs
   */
  export enum ErrorCode {
    // Validation
    INVALID_INPUT = 'INVALID_INPUT',
    MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
    
    // Parsing
    PARSE_ERROR = 'PARSE_ERROR',
    INVALID_FORMAT = 'INVALID_FORMAT',
    
    // Business logic
    NOT_FOUND = 'NOT_FOUND',
    ALREADY_EXISTS = 'ALREADY_EXISTS',
    OPERATION_FAILED = 'OPERATION_FAILED',
    
    // Excel specific
    INVALID_WORKBOOK = 'INVALID_WORKBOOK',
    INVALID_SHEET = 'INVALID_SHEET',
    EMPTY_DATA = 'EMPTY_DATA',
    
    // Unknown
    UNKNOWN = 'UNKNOWN',
  }