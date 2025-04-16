/**
 * This file demonstrates how to create custom decorators using metarize
 */
import {
  ClassDecoratorFactory,
  MethodDecoratorFactory,
  ParameterDecoratorFactory,
  PropertyDecoratorFactory,
} from 'metarize';

// Define metadata keys
export const API_ENDPOINT = 'api:endpoint';
export const API_METHOD = 'api:method';
export const API_PARAM = 'api:param';
export const API_PROPERTY = 'api:property';

// Define metadata types
export interface ApiEndpointMetadata {
  basePath: string;
  description?: string;
  tags?: string[];
}

export interface ApiMethodMetadata {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description?: string;
  responses?: Record<string, any>;
}

export interface ApiParamMetadata {
  name: string;
  description?: string;
  required?: boolean;
  type?: string;
}

export interface ApiPropertyMetadata {
  name: string;
  description?: string;
  required?: boolean;
  type?: string;
}

/**
 * Class decorator for API endpoints
 * @param spec Metadata for the API endpoint
 */
export function apiEndpoint(spec: ApiEndpointMetadata): ClassDecorator {
  return ClassDecoratorFactory.createDecorator(API_ENDPOINT, spec);
}

/**
 * Method decorator for API methods
 * @param spec Metadata for the API method
 */
export function apiMethod(spec: ApiMethodMetadata): MethodDecorator {
  return MethodDecoratorFactory.createDecorator(API_METHOD, spec);
}

/**
 * Parameter decorator for API parameters
 * @param spec Metadata for the API parameter
 */
export function apiParam(spec: ApiParamMetadata): ParameterDecorator {
  return ParameterDecoratorFactory.createDecorator(API_PARAM, spec);
}

/**
 * Property decorator for API properties
 * @param spec Metadata for the API property
 */
export function apiProperty(spec: ApiPropertyMetadata): PropertyDecorator {
  return PropertyDecoratorFactory.createDecorator(API_PROPERTY, spec);
}
