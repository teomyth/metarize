/**
 * This file demonstrates how to use MetadataInspector to retrieve metadata
 */
import { MetadataInspector } from 'metarize';
import { API_ENDPOINT, API_METHOD, API_PARAM, API_PROPERTY } from './decorators.js';
import { UserController } from './controllers.js';
import { User, CreateUserRequest } from './models.js';

/**
 * Utility to inspect and print API metadata
 */
export class ApiMetadataInspector {
  /**
   * Inspect and print controller metadata
   * @param controllerClass The controller class to inspect
   */
  static inspectController(controllerClass: Function): void {
    console.log('\n=== Controller Metadata ===');

    // Get class metadata
    const endpointMetadata = MetadataInspector.getClassMetadata(API_ENDPOINT, controllerClass);
    console.log(`Controller: ${controllerClass.name}`);
    console.log('Endpoint Metadata:', endpointMetadata);

    // Get all method metadata
    const methodsMetadata = MetadataInspector.getAllMethodMetadata(
      API_METHOD,
      controllerClass.prototype
    );
    console.log('\n=== Methods Metadata ===');

    if (methodsMetadata) {
      Object.keys(methodsMetadata).forEach(methodName => {
        if (methodName === '') return; // Skip constructor

        console.log(`\nMethod: ${methodName}`);
        console.log('Method Metadata:', methodsMetadata[methodName]);

        // Get parameter metadata for this method
        const paramsMetadata = MetadataInspector.getAllParameterMetadata(
          API_PARAM,
          controllerClass.prototype,
          methodName
        );

        if (paramsMetadata && paramsMetadata.length > 0) {
          console.log('Parameters:');
          paramsMetadata.forEach((paramMetadata, index) => {
            if (paramMetadata) {
              console.log(`  Parameter ${index}:`, paramMetadata);
            }
          });
        }
      });
    }
  }

  /**
   * Inspect and print model metadata
   * @param modelClass The model class to inspect
   */
  static inspectModel(modelClass: Function): void {
    console.log(`\n=== Model: ${modelClass.name} ===`);

    // Get all property metadata
    const propertiesMetadata = MetadataInspector.getAllPropertyMetadata(
      API_PROPERTY,
      modelClass.prototype
    );

    if (propertiesMetadata) {
      console.log('Properties:');
      Object.keys(propertiesMetadata).forEach(propertyName => {
        console.log(`  ${propertyName}:`, propertiesMetadata[propertyName]);

        // Get design-time type information if available
        const designType = MetadataInspector.getDesignTypeForProperty(
          modelClass.prototype,
          propertyName
        );

        if (designType) {
          console.log(`    Design Type: ${designType.name}`);
        }
      });
    }
  }
}
