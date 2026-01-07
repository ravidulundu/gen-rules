import { Context, Next } from 'hono';
import { Logger } from '@/lib/logger';

interface TenantVariables {
  tenantId: string;
}

/**
 * Multi-tenant isolation middleware
 * Requires X-Tenant-ID header for all requests
 * OPTIONAL MODULE - Only included with --with-tenant flag
 */
export async function tenantMiddleware(
  c: Context<{ Variables: TenantVariables }>,
  next: Next,
): Promise<Response | void> {
  const tenantId = c.req.header('X-Tenant-ID');

  if (!tenantId) {
    Logger.warn('Request without tenant ID');
    return c.json(
      {
        error: 'TENANT_REQUIRED',
        message: 'X-Tenant-ID header is required',
      },
      401,
    );
  }

  // Validate tenant ID format (UUID or custom format)
  const tenantIdPattern = /^[a-zA-Z0-9-_]+$/;
  if (!tenantIdPattern.test(tenantId)) {
    Logger.warn('Invalid tenant ID format', { tenantId });
    return c.json(
      {
        error: 'INVALID_TENANT',
        message: 'Invalid tenant ID format',
      },
      400,
    );
  }

  c.set('tenantId', tenantId);
  Logger.info('Tenant context set', { tenantId });

  return next();
}
