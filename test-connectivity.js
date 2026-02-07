#!/usr/bin/env node

/**
 * Backend-Frontend Connectivity Test Script
 * 
 * This script tests the connection between the frontend and backend.
 * It simulates frontend API calls and verifies backend responses.
 * 
 * Usage:
 *   1. Start the backend: cd backend && bun run dev
 *   2. In another terminal, run: node test-connectivity.js
 */

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8787';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

async function testEndpoint(name, url, options = {}) {
  try {
    logInfo(`Testing ${name}...`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Origin': FRONTEND_ORIGIN,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const status = response.status;
    const headers = Object.fromEntries(response.headers.entries());
    
    // Check CORS headers
    const corsHeaders = {
      'access-control-allow-origin': headers['access-control-allow-origin'],
      'access-control-allow-methods': headers['access-control-allow-methods'],
      'access-control-allow-headers': headers['access-control-allow-headers'],
    };

    let data = null;
    const contentType = headers['content-type'] || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return {
      success: response.ok,
      status,
      headers,
      corsHeaders,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      status: null,
      headers: {},
      corsHeaders: {},
      data: null,
      error: error.message,
    };
  }
}

async function runTests() {
  log('\n' + '='.repeat(60), 'cyan');
  log('Backend-Frontend Connectivity Test', 'cyan');
  log('='.repeat(60) + '\n', 'cyan');

  logInfo(`Backend URL: ${API_BASE_URL}`);
  logInfo(`Frontend Origin: ${FRONTEND_ORIGIN}\n`);

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
  };

  // Test 1: Health Check
  log('\n[1/7] Health Check Endpoint', 'cyan');
  const healthTest = await testEndpoint('Health Check', `${API_BASE_URL}/health`);
  if (healthTest.success && healthTest.data?.ok) {
    logSuccess(`Health check passed: ${JSON.stringify(healthTest.data)}`);
    results.passed++;
  } else {
    logError(`Health check failed: ${healthTest.error || `Status ${healthTest.status}`}`);
    if (healthTest.error?.includes('ECONNREFUSED')) {
      logWarning('Make sure the backend is running: cd backend && bun run dev');
    }
    results.failed++;
  }

  // Test 2: CORS Configuration
  log('\n[2/7] CORS Configuration', 'cyan');
  if (healthTest.corsHeaders['access-control-allow-origin']) {
    const corsOrigin = healthTest.corsHeaders['access-control-allow-origin'];
    if (corsOrigin === '*' || corsOrigin === FRONTEND_ORIGIN) {
      logSuccess(`CORS configured correctly: ${corsOrigin}`);
      results.passed++;
    } else {
      logWarning(`CORS allows origin: ${corsOrigin}, but frontend is: ${FRONTEND_ORIGIN}`);
      results.warnings++;
    }
  } else {
    logWarning('CORS headers not found (may be configured differently)');
    results.warnings++;
  }

  // Test 3: Products List Endpoint
  log('\n[3/7] Products List Endpoint', 'cyan');
  const productsTest = await testEndpoint('Products List', `${API_BASE_URL}/api/products?limit=5`);
  if (productsTest.success && Array.isArray(productsTest.data?.items)) {
    logSuccess(`Products endpoint working: ${productsTest.data.items.length} items returned`);
    logInfo(`Response structure: { items: Array, page: ${productsTest.data.page || 'N/A'}, limit: ${productsTest.data.limit || 'N/A'}, total: ${productsTest.data.total || 'N/A'} }`);
    results.passed++;
  } else {
    logError(`Products endpoint failed: ${productsTest.error || `Status ${productsTest.status}`}`);
    if (productsTest.data) {
      logInfo(`Response: ${JSON.stringify(productsTest.data).substring(0, 200)}...`);
    }
    results.failed++;
  }

  // Test 4: Categories Endpoint
  log('\n[4/7] Categories Endpoint', 'cyan');
  const categoriesTest = await testEndpoint('Categories', `${API_BASE_URL}/api/categories`);
  if (categoriesTest.success) {
    logSuccess(`Categories endpoint working`);
    if (Array.isArray(categoriesTest.data)) {
      logInfo(`Found ${categoriesTest.data.length} categories`);
    } else if (categoriesTest.data?.items) {
      logInfo(`Found ${categoriesTest.data.items.length} categories`);
    }
    results.passed++;
  } else {
    logError(`Categories endpoint failed: ${categoriesTest.error || `Status ${categoriesTest.status}`}`);
    results.failed++;
  }

  // Test 5: Brands Endpoint
  log('\n[5/7] Brands Endpoint', 'cyan');
  const brandsTest = await testEndpoint('Brands', `${API_BASE_URL}/api/brands`);
  if (brandsTest.success) {
    logSuccess(`Brands endpoint working`);
    if (Array.isArray(brandsTest.data)) {
      logInfo(`Found ${brandsTest.data.length} brands`);
    } else if (brandsTest.data?.items) {
      logInfo(`Found ${brandsTest.data.items.length} brands`);
    }
    results.passed++;
  } else {
    logError(`Brands endpoint failed: ${brandsTest.error || `Status ${brandsTest.status}`}`);
    results.failed++;
  }

  // Test 6: Cart Endpoint (GET)
  log('\n[6/7] Cart Endpoint', 'cyan');
  const cartTest = await testEndpoint('Cart', `${API_BASE_URL}/api/cart`, {
    headers: {
      'x-cart-id': 'test-cart-id-123',
    },
  });
  if (cartTest.success || cartTest.status === 404) {
    // 404 is acceptable for cart if it doesn't exist
    logSuccess(`Cart endpoint accessible (status: ${cartTest.status})`);
    results.passed++;
  } else {
    logError(`Cart endpoint failed: ${cartTest.error || `Status ${cartTest.status}`}`);
    results.failed++;
  }

  // Test 7: Reviews Endpoint
  log('\n[7/7] Reviews Endpoint', 'cyan');
  const reviewsTest = await testEndpoint('Reviews', `${API_BASE_URL}/api/reviews?limit=5`);
  if (reviewsTest.success) {
    logSuccess(`Reviews endpoint working`);
    if (Array.isArray(reviewsTest.data)) {
      logInfo(`Found ${reviewsTest.data.length} reviews`);
    } else if (reviewsTest.data?.items) {
      logInfo(`Found ${reviewsTest.data.items.length} reviews`);
    }
    results.passed++;
  } else {
    logWarning(`Reviews endpoint returned status ${reviewsTest.status} (may be empty)`);
    results.warnings++;
  }

  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  log('Test Summary', 'cyan');
  log('='.repeat(60), 'cyan');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Warnings: ${results.warnings}`, results.warnings > 0 ? 'yellow' : 'reset');
  log('='.repeat(60) + '\n', 'cyan');

  if (results.failed === 0) {
    logSuccess('All critical tests passed! Backend is ready for frontend integration.', 'green');
    return 0;
  } else {
    logError('Some tests failed. Please check the backend configuration.', 'red');
    return 1;
  }
}

// Run tests
runTests()
  .then((exitCode) => {
    process.exit(exitCode);
  })
  .catch((error) => {
    logError(`Test script error: ${error.message}`);
    console.error(error);
    process.exit(1);
  });

