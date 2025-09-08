// Simple test to verify analytics service functions
import { analyticsService } from './analyticsService';

// This is a simple test to verify the functions exist and can be called
console.log('Testing analytics service...');

// Test that the service functions exist
console.log('trackPropertyView function exists:', typeof analyticsService.trackPropertyView === 'function');
console.log('getPropertyViews function exists:', typeof analyticsService.getPropertyViews === 'function');
console.log('getLandlordTotalViews function exists:', typeof analyticsService.getLandlordTotalViews === 'function');
console.log('getPopularProperties function exists:', typeof analyticsService.getPopularProperties === 'function');
console.log('getPopularPropertiesAdmin function exists:', typeof analyticsService.getPopularPropertiesAdmin === 'function');
console.log('getLandlordAnalyticsSummary function exists:', typeof analyticsService.getLandlordAnalyticsSummary === 'function');
console.log('getAdminAnalyticsSummary function exists:', typeof analyticsService.getAdminAnalyticsSummary === 'function');

console.log('Analytics service test completed.');